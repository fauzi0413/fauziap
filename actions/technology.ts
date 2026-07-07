"use server";

import { technologyService, TechnologyPayload } from "@/services/technology";
import { revalidatePath } from "next/cache";

export async function createTechnologyAction(data: TechnologyPayload) {
  try {
    const technology = await technologyService.create(data);
    revalidatePath("/admin/technologies");
    return { success: true, data: technology };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTechnologyAction(id: string, data: Partial<TechnologyPayload>) {
  try {
    const technology = await technologyService.update(id, data);
    revalidatePath("/admin/technologies");
    return { success: true, data: technology };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTechnologyAction(id: string) {
  try {
    await technologyService.delete(id);
    revalidatePath("/admin/technologies");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
