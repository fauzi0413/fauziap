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
      blogs,
      messages,
      visitors,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.technology.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.education.count(),
      prisma.certificate.count(),
      prisma.blog.count(),
      prisma.contactMessage.count(),
      prisma.visitor.count(),
    ]);

    return {
      projects,
      technologies,
      skills,
      experiences,
      educations,
      certificates,
      blogs,
      messages,
      visitors,
    };
  }

  async getRecentActivity() {
    const [projects, blogs, messages] = await Promise.all([
      prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        take: 4,
        select: { id: true, title: true, updatedAt: true },
      }),
      prisma.blog.findMany({
        orderBy: { updatedAt: "desc" },
        take: 4,
        select: { id: true, title: true, updatedAt: true, isPublished: true },
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: { id: true, name: true, email: true, createdAt: true, isRead: true },
      }),
    ]);

    return [
      ...projects.map((item) => ({
        id: `project-${item.id}`,
        label: item.title,
        type: "Project updated",
        date: item.updatedAt,
      })),
      ...blogs.map((item) => ({
        id: `blog-${item.id}`,
        label: item.title,
        type: item.isPublished ? "Blog published" : "Blog draft",
        date: item.updatedAt,
      })),
      ...messages.map((item) => ({
        id: `message-${item.id}`,
        label: `${item.name} (${item.email})`,
        type: item.isRead ? "Message read" : "New message",
        date: item.createdAt,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 8);
  }
}

export const adminRepository = new AdminRepository();
