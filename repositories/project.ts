import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const projectIncludes = {
  technologies: { 
    include: { 
      technology: {
        include: { skills: { select: { displayOrder: true } } }
      } 
    } 
  },
  images: { orderBy: { displayOrder: "asc" as const } },
  experience: true,
  education: true,
};

export class ProjectRepository {
  findAll() {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: projectIncludes,
    });
  }

  findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: projectIncludes,
    });
  }

  findBySlug(slug: string) {
    return prisma.project.findUnique({ where: { slug } });
  }

  create(data: Prisma.ProjectUncheckedCreateInput) {
    return prisma.project.create({ data, include: projectIncludes });
  }

  update(id: string, data: Prisma.ProjectUncheckedUpdateInput) {
    return prisma.project.update({ where: { id }, data, include: projectIncludes });
  }

  delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }

  // ── Image helpers ──────────────────────────────────────────────
  addImage(projectId: string, imageUrl: string, altText: string | null, displayOrder: number) {
    return prisma.projectImage.create({
      data: { projectId, imageUrl, altText, displayOrder },
    });
  }

  deleteImage(imageId: string) {
    return prisma.projectImage.delete({ where: { id: imageId } });
  }

  replaceImages(projectId: string, images: { imageUrl: string; altText?: string | null; displayOrder: number }[]) {
    return prisma.$transaction([
      prisma.projectImage.deleteMany({ where: { projectId } }),
      ...(images.length > 0
        ? [prisma.projectImage.createMany({ data: images.map((img) => ({ ...img, projectId })) })]
        : []),
    ]);
  }

  // ── Technology helpers ─────────────────────────────────────────
  setTechnologies(projectId: string, technologyIds: string[]) {
    return prisma.$transaction([
      prisma.projectTechnology.deleteMany({ where: { projectId } }),
      ...(technologyIds.length > 0
        ? [
            prisma.projectTechnology.createMany({
              data: technologyIds.map((technologyId) => ({ projectId, technologyId })),
            }),
          ]
        : []),
    ]);
  }
}

export const projectRepository = new ProjectRepository();
