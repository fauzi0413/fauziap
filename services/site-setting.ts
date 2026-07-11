import { siteSettingRepository } from "@/repositories/site-setting";

export interface SiteSettingPayload {
  siteName?: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  openGraphImage?: string | null;
  twitterHandle?: string | null;
  googleAnalyticsId?: string | null;
  maintenanceMode?: boolean;
  footerText?: string | null;
  copyrightName?: string | null;
}

export class SiteSettingService {
  getSetting() {
    return siteSettingRepository.getSetting();
  }

  async updateSetting(data: SiteSettingPayload) {
    const current = await this.getSetting();

    const payload = {
      ...(data.siteName !== undefined && { siteName: data.siteName }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      ...(data.faviconUrl !== undefined && { faviconUrl: data.faviconUrl }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
      ...(data.openGraphImage !== undefined && { openGraphImage: data.openGraphImage }),
      ...(data.twitterHandle !== undefined && { twitterHandle: data.twitterHandle }),
      ...(data.googleAnalyticsId !== undefined && { googleAnalyticsId: data.googleAnalyticsId }),
      ...(data.maintenanceMode !== undefined && { maintenanceMode: data.maintenanceMode }),
      ...(data.footerText !== undefined && { footerText: data.footerText }),
      ...(data.copyrightName !== undefined && { copyrightName: data.copyrightName }),
    };

    return siteSettingRepository.update(current.id, payload);
  }
}

export const siteSettingService = new SiteSettingService();
