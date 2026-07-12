"use server";

import { revalidatePath } from "next/cache";
import { researchService, type ResearchCreateInput } from "@/services/research";
import type { Prisma } from "@prisma/client";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Terjadi kesalahan sistem";
}

export async function createResearchAction(data: ResearchCreateInput) {
  try {
    const research = await researchService.create(data);
    revalidatePath("/admin/research");
    return { success: true, data: research };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateResearchAction(id: string, data: Prisma.ResearchUpdateInput) {
  try {
    const research = await researchService.update(id, data);
    revalidatePath("/admin/research");
    return { success: true, data: research };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteResearchAction(id: string) {
  try {
    await researchService.delete(id);
    revalidatePath("/admin/research");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
