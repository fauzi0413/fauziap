import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type ProjectListParams = {
  query?: string;
  technology?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
};

export type BlogListParams = {
  query?: string;
  page?: number;
  pageSize?: number;
};

export class PortfolioRepository {
  getProfile() {
    return prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
      include: { user: true },
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

  async getBlogs(params: BlogListParams = {}) {
    const page = Math.max(params.page ?? 1, 1);
    const pageSize = Math.min(Math.max(params.pageSize ?? 6, 1), 18);
    const where: Prisma.BlogWhereInput = {
      isPublished: true,
    };

    if (params.query) {
      where.OR = [
        { title: { contains: params.query, mode: "insensitive" } },
        { excerpt: { contains: params.query, mode: "insensitive" } },
        { content: { contains: params.query, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { author: true },
      }),
      prisma.blog.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    };
  }

  getBlogBySlug(slug: string) {
    return prisma.blog.findUnique({
      where: { slug },
      include: { author: true },
    });
  }

  getRelatedBlogs(currentSlug: string) {
    return prisma.blog.findMany({
      where: {
        slug: { not: currentSlug },
        isPublished: true,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { author: true },
    });
  }

  createContactMessage(data: Prisma.ContactMessageCreateInput) {
    return prisma.contactMessage.create({ data });
  }
}

export const portfolioRepository = new PortfolioRepository();
