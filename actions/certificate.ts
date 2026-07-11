"use server";

import { revalidatePath } from "next/cache";
import { certificateService, type CertificatePayload } from "@/services/certificate";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Terjadi kesalahan sistem";
}

export async function createCertificateAction(data: CertificatePayload) {
  try {
    const certificate = await certificateService.create(data);
    revalidatePath("/admin/certificates");
    return { success: true, data: certificate };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateCertificateAction(id: string, data: Partial<CertificatePayload>) {
  try {
    const certificate = await certificateService.update(id, data);
    revalidatePath("/admin/certificates");
    return { success: true, data: certificate };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function deleteCertificateAction(id: string) {
  try {
    await certificateService.delete(id);
    revalidatePath("/admin/certificates");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
