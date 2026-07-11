import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class SkillRepository {
  findAll() {
    return prisma.skill.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      include: { technology: true },
    });
  }

  findById(id: string) {
    return prisma.skill.findUnique({
      where: { id },
      include: { technology: true },
    });
  }

  create(data: Prisma.SkillCreateInput) {
    return prisma.skill.create({
      data,
      include: { technology: true },
    });
  }

  update(id: string, data: Prisma.SkillUpdateInput) {
    return prisma.skill.update({
      where: { id },
      data,
      include: { technology: true },
    });
  }

  delete(id: string) {
    return prisma.skill.delete({ where: { id } });
  }
}

export const skillRepository = new SkillRepository();
