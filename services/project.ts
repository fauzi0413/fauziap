import { projectRepository } from "@/repositories/project";
import { generateSlug } from "@/utils/media";

export interface ProjectImagePayload {
  imageUrl: string;
  altText?: string | null;
  displayOrder: number;
}

export interface ProjectPayload {
  title: string;
  slug?: string;
  thumbnail?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  background?: string | null;
  objectives?: string | null;
  solutions?: string | null;
  architecture?: string | null;
  challenges?: string | null;
  lessons?: string | null;
  repositoryUrl?: string | null;
  demoUrl?: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
  technologyIds?: string[];
  images?: ProjectImagePayload[];
  experienceId?: string | null;
  educationId?: string | null;
}

export class ProjectService {
  getAll() {
    return projectRepository.findAll();
  }

  getById(id: string) {
    return projectRepository.findById(id);
  }

  async create(data: ProjectPayload) {
    const slug = data.slug || generateSlug(data.title);

    const existing = await projectRepository.findBySlug(slug);
    if (existing) throw new Error(`Slug "${slug}" sudah digunakan.`);

    const { technologyIds = [], images = [], experienceId, educationId, ...rest } = data;

    const project = await projectRepository.create({
      ...rest,
      slug,
      experienceId: experienceId || null,
      educationId: educationId || null,
      technologies: {
        create: technologyIds.map((technologyId) => ({ technologyId })),
      },
      images: {
        create: images,
      },
    });

    return project;
  }

  async update(id: string, data: Partial<ProjectPayload>) {
    const { technologyIds, images, slug: rawSlug, experienceId, educationId, ...rest } = data;

    // Slug uniqueness check if changed
    let slug = rawSlug;
    if (slug) {
      const existing = await projectRepository.findBySlug(slug);
      if (existing && existing.id !== id) throw new Error(`Slug "${slug}" sudah digunakan.`);
    }

    const project = await projectRepository.update(id, { 
      ...rest, 
      ...(slug && { slug }),
      ...(experienceId !== undefined && { experienceId: experienceId || null }),
      ...(educationId !== undefined && { educationId: educationId || null }),
    });

    if (technologyIds !== undefined) {
      await projectRepository.setTechnologies(id, technologyIds);
    }

    if (images !== undefined) {
      await projectRepository.replaceImages(id, images);
    }

    return project;
  }

  delete(id: string) {
    return projectRepository.delete(id);
  }
}

export const projectService = new ProjectService();
