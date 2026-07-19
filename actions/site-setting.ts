"use server";

import { revalidatePath } from "next/cache";
import { siteSettingService, type SiteSettingPayload } from "@/services/site-setting";

export async function saveSiteSettingsAction(data: SiteSettingPayload) {
  try {
    const setting = await siteSettingService.updateSetting(data);
    
    // Pecah cache global (Home page, dan seluruh halaman turunan yang pakai SEO Setting ini)
    revalidatePath("/");
    revalidatePath("/admin/settings");
    
    return { success: true, data: setting };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Gagal memperbarui pengaturan situs." 
    };
  }
}

export async function clearSiteSettingImageAction(field: "logoUrl" | "faviconUrl" | "openGraphImage") {
  try {
    await siteSettingService.updateSetting({ [field]: null });
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Gagal menghapus pengaturan situs." 
    };
  }
}
