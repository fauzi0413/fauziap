import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class EducationRepository {
  findAll() {
    return prisma.education.findMany({
      orderBy: { startDate: "desc" },
    });
  }

  findById(id: string) {
    return prisma.education.findUnique({ where: { id } });
  }

  create(data: Prisma.EducationCreateInput) {
    return prisma.education.create({ data });
  }

  update(id: string, data: Prisma.EducationUpdateInput) {
    return prisma.education.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.education.delete({ where: { id } });
  }
}

export const educationRepository = new EducationRepository();
