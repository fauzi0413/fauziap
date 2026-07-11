import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type ProjectListParams = {
  query?: string;
  technology?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
};


export interface ProfilePayload {
  fullName: string;
  title: string;
  shortBio?: string | null;
  fullBio?: string | null;
  resumeUrl?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  avatarUrl?: string | null;
};

export class PortfolioRepository {
  getProfile() {
    return prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
      include: { user: true },
    });
  }

  async upsertProfile(data: ProfilePayload) {
    const existing = await prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (existing) {
      return prisma.profile.update({
        where: { id: existing.id },
        data,
      });
    }

    // Fallback: create profile linked to the first user found
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("Tidak ada user yang terdaftar.");

    return prisma.profile.create({
      data: { ...data, userId: user.id },
    });
  }

  getSkills() {
    return prisma.skill.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      include: { technology: true },
    });
  }

  getTechnologies() {
    return prisma.technology.findMany({
      orderBy: { name: "asc" },
    });
  }

  getExperiences() {
    return prisma.experience.findMany({
      orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
    });
  }

  getEducations() {
    return prisma.education.findMany({
      orderBy: { startDate: "desc" },
    });
  }

  getCertificates() {
    return prisma.certificate.findMany({
      orderBy: { issueDate: "desc" },
    });
  }

  async getProjects(params: ProjectListParams = {}) {
    const page = Math.max(params.page ?? 1, 1);
    const pageSize = Math.min(Math.max(params.pageSize ?? 9, 1), 24);
    const where: Prisma.ProjectWhereInput = {};

    if (params.query) {
      where.OR = [
        { title: { contains: params.query, mode: "insensitive" } },
        { shortDescription: { contains: params.query, mode: "insensitive" } },
        { fullDescription: { contains: params.query, mode: "insensitive" } },
      ];
    }

    if (params.technology) {
      where.technologies = {
        some: {
          technology: {
            slug: params.technology,
          },
        },
      };
    }

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: params.sort === "oldest" ? "asc" : "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          technologies: { include: { technology: true } },
          images: { orderBy: { displayOrder: "asc" } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    };
  }

  getFeaturedProjects() {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        technologies: { include: { technology: true } },
        images: { orderBy: { displayOrder: "asc" } },
      },
    });
  }

  getProjectBySlug(slug: string) {
    return prisma.project.findUnique({
      where: { slug },
      include: {
        technologies: { include: { technology: true } },
        images: { orderBy: { displayOrder: "asc" } },
      },
    });
  }

  getRelatedProjects(projectId: string, technologyIds: string[]) {
    if (technologyIds.length === 0) return [];

    return prisma.project.findMany({
      where: {
        id: { not: projectId },
        technologies: {
          some: {
            technologyId: { in: technologyIds },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        technologies: { include: { technology: true } },
        images: { orderBy: { displayOrder: "asc" } },
      },
    });
  }


}

export const portfolioRepository = new PortfolioRepository();
