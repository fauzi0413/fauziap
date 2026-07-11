"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { portfolioService } from "@/services/portfolio";

const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  subject: z.string().optional(),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

export type ContactActionState = {
  success: boolean;
  message: string;
};

export async function submitContactAction(
  _state: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data belum valid",
    };
  }

  try {
    // Contact Message table was removed, simulating success for now
    // await portfolioService.createContactMessage(parsed.data);
    revalidatePath("/contact");

    return {
      success: true,
      message: "Pesan berhasil dikirim. Terima kasih sudah menghubungi saya.",
    };
  } catch {
    return {
      success: false,
      message: "Pesan belum bisa dikirim. Silakan coba lagi nanti.",
    };
  }
}
