"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { projectService, type ProjectPayload } from "@/services/project";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Terjadi kesalahan sistem";
}

export async function createProjectAction(data: ProjectPayload) {
  try {
    const project = await projectService.create(data);
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateProjectAction(id: string, data: Partial<ProjectPayload>) {
  try {
    const project = await projectService.update(id, data);
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}/edit`);
    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await projectService.delete(id);
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

/** Create + redirect to the edit page */
export async function createProjectAndRedirect(data: ProjectPayload) {
  let id: string | undefined;
  try {
    const project = await projectService.create(data);
    revalidatePath("/admin/projects");
    id = project.id;
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
  redirect(`/admin/projects/${id}/edit`);
}
