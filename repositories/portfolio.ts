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

  getTechnologies(opts?: { hasProject?: boolean }) {
    const where = opts?.hasProject ? {
      projectTechnology: { some: {} }
    } : undefined;

    return prisma.technology.findMany({
      where,
      orderBy: { name: "asc" },
    });
  }

  getExperiences(params?: { isFeatured?: boolean }) {
    return prisma.experience.findMany({
      where: params?.isFeatured !== undefined ? { isFeatured: params.isFeatured } : undefined,
      orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
      include: {
        technologies: {
          include: { technology: true }
        },
        education: true,
        projects: {
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
        }
      }
    });
  }

  getEducations() {
    return prisma.education.findMany({
      orderBy: { startDate: "desc" },
      include: {
        projects: {
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
        },
        experiences: {
          orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
        },
        finalProject: true,
      },
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
    const where: Prisma.ProjectWhereInput = {
      isPublished: true,
    };

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
        orderBy: [
          { isFeatured: "desc" },
          { createdAt: params.sort === "oldest" ? "asc" : "desc" }
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          technologies: { 
            include: { 
              technology: {
                include: { skills: { select: { displayOrder: true } } }
              } 
            } 
          },
          images: { orderBy: { displayOrder: "asc" } },
          experience: true,
          education: true,
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
      where: { isPublished: true },
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" }
      ],
      take: 3,
      include: {
        technologies: { 
          include: { 
            technology: {
              include: { skills: { select: { displayOrder: true } } }
            } 
          } 
        },
        images: { orderBy: { displayOrder: "asc" } },
        experience: true,
        education: true,
      },
    });
  }

  getProjectBySlug(slug: string) {
    return prisma.project.findUnique({
      where: { slug, isPublished: true },
      include: {
        technologies: { 
          include: { 
            technology: {
              include: { skills: { select: { displayOrder: true } } }
            } 
          } 
        },
        images: { orderBy: { displayOrder: "asc" } },
        experience: true,
        education: true,
      },
    });
  }

  getRelatedProjects(projectId: string, technologyIds: string[]) {
    if (technologyIds.length === 0) return [];

    return prisma.project.findMany({
      where: {
        id: { not: projectId },
        isPublished: true,
        technologies: {
          some: {
            technologyId: { in: technologyIds },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        technologies: { 
          include: { 
            technology: {
              include: { skills: { select: { displayOrder: true } } }
            } 
          } 
        },
        images: { orderBy: { displayOrder: "asc" } },
        experience: true,
        education: true,
      },
    });
  }


}

export const portfolioRepository = new PortfolioRepository();
