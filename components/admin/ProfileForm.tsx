"use client";

import { useActionState, useState } from "react";
import { updateProfileAction, type ProfileActionState } from "@/actions/profile";
import { convertGoogleDriveUrl, isGoogleDriveLink } from "@/utils/media";
import type { Profile } from "@prisma/client";
import { ImageOff, Link2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

const initialState: ProfileActionState = { success: false, message: "" };

// removed duplicate convertGoogleDriveUrl and isGoogleDriveLink

// ---------------------------------------------------------------------------
// InputField — generic
// ---------------------------------------------------------------------------
function InputField({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  wide,
  multiline,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  type?: string;
  wide?: boolean;
  multiline?: boolean;
}) {
  const base =
    "mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800";

  return (
    <div className={wide ? "md:col-span-2" : undefined}>
      <label
        htmlFor={name}
        className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder ?? `Masukkan ${label}…`}
          rows={4}
          className={`${base} py-2`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder ?? `Masukkan ${label}…`}
          className={`${base} h-10`}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AvatarField — controlled, with Drive conversion & live preview
// ---------------------------------------------------------------------------
function AvatarField({
  initialRaw,
  initialConverted,
  fullName,
}: {
  initialRaw: string;
  initialConverted: string;
  fullName: string;
}) {
  const [rawUrl, setRawUrl] = useState(initialRaw);
  const [previewUrl, setPreviewUrl] = useState(initialConverted);
  const [imgError, setImgError] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setRawUrl(val);
    setImgError(false);
    setPreviewUrl(val ? convertGoogleDriveUrl(val) : "");
  }

  const isDrive = isGoogleDriveLink(rawUrl);

  return (
    <div className="space-y-4">
      {/* Live preview */}
      <div className="aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
        {previewUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={fullName || "Avatar"}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center text-sm text-gray-400">
            {imgError ? (
              <>
                <ImageOff className="h-8 w-8 opacity-50" />
                <span>Gambar tidak dapat dimuat</span>
              </>
            ) : (
              <span>Foto profil belum tersedia.</span>
            )}
          </div>
        )}
      </div>

      {/* Raw input (what user types & what gets saved) */}
      <div>
        <label
          htmlFor="avatarUrl"
          className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400"
        >
          URL Foto Profil
        </label>
        <input
          id="avatarUrl"
          name="avatarUrl"
          type="text"
          value={rawUrl}
          onChange={handleChange}
          placeholder="https://… atau link Google Drive"
          className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800"
        />
        <div className="mt-2">
          <ImageUpload
             value={rawUrl === previewUrl ? "" : "(Vercel Blob)"} // Dummy value just to show checkmark if needed
             onChange={(url) => {
               setRawUrl(url);
               setPreviewUrl(url);
               setImgError(false);
             }}
             label="Unggah Foto Baru"
          />
        </div>

        {/* Hidden field with converted value — inilah yang dikirim ke server action */}
        <input type="hidden" name="avatarUrlConverted" value={previewUrl} />

        {/* Badge informasi Drive */}
        {isDrive && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
            <Link2 className="h-3.5 w-3.5" />
            Link Google Drive terdeteksi — dikonversi otomatis untuk embed.
          </div>
        )}
        {imgError && rawUrl && (
          <p className="mt-1 text-xs text-red-500">
            URL tidak dapat dimuat. Pastikan file Drive sudah disetel ke &quot;Anyone with the link can view&quot;.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProfileForm
// ---------------------------------------------------------------------------
export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  // Hitung nilai awal avatar
  const initialRaw = profile?.avatarUrl ?? "";
  const initialConverted = initialRaw ? convertGoogleDriveUrl(initialRaw) : "";

  return (
    <form action={formAction}>
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        {/* Left: avatar */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <AvatarField
            initialRaw={initialRaw}
            initialConverted={initialConverted}
            fullName={profile?.fullName ?? ""}
          />
        </div>

        {/* Right: fields */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Data Profil</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InputField label="Nama Lengkap" name="fullName" defaultValue={profile?.fullName} />
            <InputField
              label="Headline"
              name="title"
              defaultValue={profile?.title}
              placeholder="e.g. Full-Stack Developer"
            />
            <InputField
              label="Lokasi"
              name="location"
              defaultValue={profile?.location}
              placeholder="e.g. Jakarta, Indonesia"
            />
            <InputField
              label="Email (Kontak Resume)"
              name="email"
              defaultValue={profile?.email}
              placeholder="e.g. hello@example.com"
              type="email"
            />
            <InputField
              label="No. Handphone"
              name="phone"
              defaultValue={profile?.phone}
              placeholder="e.g. +62 812 3456 7890"
            />
            <InputField
              label="GitHub"
              name="githubUrl"
              defaultValue={profile?.githubUrl}
              placeholder="https://github.com/username"
            />
            <InputField
              label="LinkedIn"
              name="linkedinUrl"
              defaultValue={profile?.linkedinUrl}
              placeholder="https://linkedin.com/in/username"
            />
            <InputField
              label="Website"
              name="websiteUrl"
              defaultValue={profile?.websiteUrl}
              placeholder="https://yourdomain.com"
            />
            <InputField
              label="Resume (PDF URL)"
              name="resumeUrl"
              defaultValue={profile?.resumeUrl}
              placeholder="https://example.com/resume.pdf"
            />
            <InputField label="Short Bio" name="shortBio" defaultValue={profile?.shortBio} wide multiline />
            <InputField label="Full Bio" name="fullBio" defaultValue={profile?.fullBio} wide multiline />
          </div>

          {/* Feedback */}
          {state.message && (
            <div
              className={`mt-5 rounded-md px-4 py-3 text-sm font-medium ${
                state.success
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
              }`}
            >
              {state.success ? "✓ " : "✕ "}
              {state.message}
            </div>
          )}

          {/* Save button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100"
            >
              {isPending ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Menyimpan…
                </>
              ) : (
                "Simpan Profil"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
