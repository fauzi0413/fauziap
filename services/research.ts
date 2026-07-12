import { prisma } from "@/lib/prisma";
import type { Prisma, Research } from "@prisma/client";

export type ResearchCreateInput = Prisma.ResearchCreateInput;

export class ResearchService {
  async getAll(params?: { isPublic?: boolean }) {
    const where: Prisma.ResearchWhereInput = {};
    if (params?.isPublic !== undefined) {
      where.isPublic = params.isPublic;
    }

    return prisma.research.findMany({
      where,
      orderBy: { publishDate: "desc" },
    });
  }

  async getById(id: string) {
    return prisma.research.findUnique({
      where: { id },
    });
  }

  async create(data: ResearchCreateInput) {
    return prisma.research.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ResearchUpdateInput) {
    return prisma.research.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.research.delete({
      where: { id },
    });
  }
}

export const researchService = new ResearchService();
