"use server";

import { revalidatePath } from "next/cache";
import { experienceService, type ExperiencePayload } from "@/services/experience";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Terjadi kesalahan sistem";
}

export async function createExperienceAction(data: ExperiencePayload) {
  try {
    const experience = await experienceService.create(data);
    revalidatePath("/admin/experience");
    return { success: true, data: experience };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateExperienceAction(id: string, data: Partial<ExperiencePayload>) {
  try {
    const experience = await experienceService.update(id, data);
    revalidatePath("/admin/experience");
    return { success: true, data: experience };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    await experienceService.delete(id);
    revalidatePath("/admin/experience");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
