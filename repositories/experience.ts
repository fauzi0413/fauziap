import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const experienceIncludes = {
  technologies: { include: { technology: true } }
};

export class ExperienceRepository {
  findAll() {
    return prisma.experience.findMany({
      orderBy: [{ isCurrent: 'desc' }, { startDate: "desc" }],
      include: experienceIncludes,
    });
  }

  findById(id: string) {
    return prisma.experience.findUnique({
      where: { id },
      include: experienceIncludes,
    });
  }

  create(data: Prisma.ExperienceCreateInput) {
    return prisma.experience.create({ data, include: experienceIncludes });
  }

  update(id: string, data: Prisma.ExperienceUpdateInput) {
    return prisma.experience.update({ where: { id }, data, include: experienceIncludes });
  }

  delete(id: string) {
    return prisma.experience.delete({ where: { id } });
  }

  setTechnologies(experienceId: string, technologyIds: string[]) {
    return prisma.$transaction([
      prisma.experienceTechnology.deleteMany({ where: { experienceId } }),
      ...(technologyIds.length > 0
        ? [
            prisma.experienceTechnology.createMany({
              data: technologyIds.map((technologyId) => ({ experienceId, technologyId })),
            }),
          ]
        : []),
    ]);
  }
}

export const experienceRepository = new ExperienceRepository();
