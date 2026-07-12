import { experienceRepository } from "@/repositories/experience";

export interface ExperiencePayload {
  title: string;
  company: string;
  companyLogo?: string | null;
  location?: string | null;
  type?: string | null;
  startDate: string; // ISO date string "YYYY-MM-DD"
  endDate?: string | null;
  isCurrent?: boolean;
  isFeatured?: boolean;
  description?: string | null;
  responsibilities?: string | null;
  technologyIds?: string[];
  educationId?: string | null;
}

export class ExperienceService {
  getAll() {
    return experienceRepository.findAll();
  }

  getById(id: string) {
    return experienceRepository.findById(id);
  }

  async create(data: ExperiencePayload) {
    const { technologyIds = [], ...rest } = data;

    return experienceRepository.create({
      title: rest.title,
      company: rest.company,
      companyLogo: rest.companyLogo ?? null,
      location: rest.location ?? null,
      type: rest.type ?? null,
      startDate: new Date(rest.startDate),
      endDate: rest.endDate ? new Date(rest.endDate) : null,
      isCurrent: rest.isCurrent ?? false,
      isFeatured: rest.isFeatured ?? false,
      description: rest.description ?? null,
      responsibilities: rest.responsibilities ?? null,
      education: rest.educationId ? { connect: { id: rest.educationId } } : undefined,
      technologies: {
        create: technologyIds.map((technologyId) => ({ technologyId })),
      },
    });
  }

  async update(id: string, data: Partial<ExperiencePayload>) {
    const { technologyIds, ...rest } = data;

    const experience = await experienceRepository.update(id, {
      ...(rest.title !== undefined && { title: rest.title }),
      ...(rest.company !== undefined && { company: rest.company }),
      ...(rest.companyLogo !== undefined && { companyLogo: rest.companyLogo }),
      ...(rest.location !== undefined && { location: rest.location }),
      ...(rest.type !== undefined && { type: rest.type }),
      ...(rest.startDate !== undefined && { startDate: new Date(rest.startDate) }),
      ...(rest.endDate !== undefined && { endDate: rest.endDate ? new Date(rest.endDate) : null }),
      ...(rest.isCurrent !== undefined && { isCurrent: rest.isCurrent }),
      ...(rest.isFeatured !== undefined && { isFeatured: rest.isFeatured }),
      ...(rest.description !== undefined && { description: rest.description }),
      ...(rest.responsibilities !== undefined && { responsibilities: rest.responsibilities }),
      ...(rest.educationId !== undefined && {
        education: rest.educationId ? { connect: { id: rest.educationId } } : { disconnect: true },
      }),
    });

    if (technologyIds !== undefined) {
      await experienceRepository.setTechnologies(id, technologyIds);
    }

    return experience;
  }

  delete(id: string) {
    return experienceRepository.delete(id);
  }
}

export const experienceService = new ExperienceService();
