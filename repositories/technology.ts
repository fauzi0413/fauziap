import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class TechnologyRepository {
  async findAll() {
    const technologies = await prisma.technology.findMany({
      include: { skills: { select: { displayOrder: true } } }
    });

    return technologies
      .sort((a, b) => {
        const orderA = a.skills[0]?.displayOrder ?? 999;
        const orderB = b.skills[0]?.displayOrder ?? 999;
        return orderA - orderB || a.name.localeCompare(b.name);
      })
      .map((t) => {
        const { skills, ...rest } = t;
        return rest;
      });
  }

  async findById(id: string) {
    return prisma.technology.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return prisma.technology.findUnique({
      where: { slug },
    });
  }

  async create(data: Prisma.TechnologyCreateInput) {
    return prisma.technology.create({
      data,
    });
  }

  async update(id: string, data: Prisma.TechnologyUpdateInput) {
    return prisma.technology.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.technology.delete({
      where: { id },
    });
  }
}

export const technologyRepository = new TechnologyRepository();
