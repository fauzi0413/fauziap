"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { portfolioService } from "@/services/portfolio";

const profileSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  title: z.string().min(1, "Headline wajib diisi"),
  location: z.string().optional().nullable(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")).nullable(),
  phone: z.string().optional().nullable(),
  githubUrl: z.string().url("URL GitHub tidak valid").optional().or(z.literal("")).nullable(),
  linkedinUrl: z.string().url("URL LinkedIn tidak valid").optional().or(z.literal("")).nullable(),
  websiteUrl: z.string().url("URL Website tidak valid").optional().or(z.literal("")).nullable(),
  resumeUrl: z.string().url("URL Resume tidak valid").optional().or(z.literal("")).nullable(),
  avatarUrl: z.string().optional().nullable(),
  shortBio: z.string().optional().nullable(),
  fullBio: z.string().optional().nullable(),
});

export type ProfileActionState = {
  success: boolean;
  message: string;
};

export async function updateProfileAction(
  _state: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const raw = {
    fullName: formData.get("fullName") as string,
    title: formData.get("title") as string,
    location: (formData.get("location") as string) || null,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    githubUrl: (formData.get("githubUrl") as string) || null,
    linkedinUrl: (formData.get("linkedinUrl") as string) || null,
    websiteUrl: (formData.get("websiteUrl") as string) || null,
    resumeUrl: (formData.get("resumeUrl") as string) || null,
    // avatarUrlConverted = hasil konversi Google Drive → lh3.googleusercontent.com (dari hidden field)
    avatarUrl: (formData.get("avatarUrlConverted") as string) || (formData.get("avatarUrl") as string) || null,
    shortBio: (formData.get("shortBio") as string) || null,
    fullBio: (formData.get("fullBio") as string) || null,
  };

  const parsed = profileSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data belum valid.",
    };
  }

  try {
    await portfolioService.upsertProfile(parsed.data);
    revalidatePath("/admin/profile");
    revalidatePath("/");

    return {
      success: true,
      message: "Profil berhasil disimpan.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan profil.",
    };
  }
}
