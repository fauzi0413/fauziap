import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class ResumeSettingRepository {
  /**
   * Mengambil setting pertama (karena ini singleton)
   */
  async getSetting() {
    const setting = await prisma.resumeSetting.findFirst();
    if (setting) return setting;

    // Default initialization jika belum ada record sama sekali
    return prisma.resumeSetting.create({
      data: {
        showExperience: true,
        showEducation: true,
        showProjects: true,
        showCertificates: false,
        showSkills: true,
        sectionOrder: JSON.stringify([
          "experience",
          "education",
          "skills",
          "projects",
          "certificates",
        ]),
        isAtsOptimized: true,
      },
    });
  }

  update(id: string, data: Prisma.ResumeSettingUpdateInput) {
    return prisma.resumeSetting.update({
      where: { id },
      data,
    });
  }
}

export const resumeSettingRepository = new ResumeSettingRepository();
