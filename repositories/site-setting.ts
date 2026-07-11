import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class SiteSettingRepository {
  /**
   * Mengambil setting situs (Single record)
   */
  async getSetting() {
    const setting = await prisma.siteSetting.findFirst();
    if (setting) return setting;

    return prisma.siteSetting.create({
      data: {
        siteName: "Personal Portfolio",
        seoTitle: "Portfolio & Resume",
        maintenanceMode: false,
        copyrightName: "Developer",
      },
    });
  }

  update(id: string, data: Prisma.SiteSettingUpdateInput) {
    return prisma.siteSetting.update({
      where: { id },
      data,
    });
  }
}

export const siteSettingRepository = new SiteSettingRepository();
