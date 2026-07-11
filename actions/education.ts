"use server";

import { revalidatePath } from "next/cache";
import { educationService, type EducationPayload } from "@/services/education";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Terjadi kesalahan sistem";
}

export async function createEducationAction(data: EducationPayload) {
  try {
    const education = await educationService.create(data);
    revalidatePath("/admin/education");
    return { success: true, data: education };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateEducationAction(id: string, data: Partial<EducationPayload>) {
  try {
    const education = await educationService.update(id, data);
    revalidatePath("/admin/education");
    return { success: true, data: education };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteEducationAction(id: string) {
  try {
    await educationService.delete(id);
    revalidatePath("/admin/education");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
