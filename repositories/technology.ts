import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class TechnologyRepository {
  async findAll() {
    return prisma.technology.findMany({
      orderBy: { createdAt: "desc" },
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
