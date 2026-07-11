"use server";

import { revalidatePath } from "next/cache";
import { resumeSettingService, type ResumeSettingPayload } from "@/services/resume-setting";

export async function saveResumeSettingsAction(data: ResumeSettingPayload) {
  try {
    const setting = await resumeSettingService.updateSetting(data);
    revalidatePath("/admin/resume");
    return { success: true, data: setting };
  } catch (error: unknown) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Terjadi kesalahan sistem saat menyimpan pengaturan." 
    };
  }
}
