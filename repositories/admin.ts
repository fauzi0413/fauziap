import { prisma } from "@/lib/prisma";

export class AdminRepository {
  async getDashboardStats() {
    const [
      projects,
      technologies,
      skills,
      experiences,
      educations,
      certificates,
      visitors,
      researches,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.technology.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.education.count(),
      prisma.certificate.count(),
      prisma.visitor.count(),
      prisma.research.count(),
    ]);

    return {
      projects,
      technologies,
      skills,
      experiences,
      educations,
      certificates,
      visitors,
      researches,
    };
  }

  async getRecentActivity() {
    const [projects] = await Promise.all([
      prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        take: 4,
        select: { id: true, title: true, updatedAt: true },
      }),
    ]);

    return [
      ...projects.map((item) => ({
        id: `project-${item.id}`,
        label: item.title,
        type: "Project updated",
        date: item.updatedAt,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 8);
  }
}

export const adminRepository = new AdminRepository();
