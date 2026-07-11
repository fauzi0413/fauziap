"use server";

import { revalidatePath } from "next/cache";
import { skillService, type SkillPayload } from "@/services/skill";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Terjadi kesalahan sistem";
}

export async function createSkillAction(data: SkillPayload) {
  try {
    const skill = await skillService.create(data);
    revalidatePath("/admin/skills");
    return { success: true, data: skill };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateSkillAction(id: string, data: Partial<SkillPayload>) {
  try {
    const skill = await skillService.update(id, data);
    revalidatePath("/admin/skills");
    return { success: true, data: skill };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteSkillAction(id: string) {
  try {
    await skillService.delete(id);
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
