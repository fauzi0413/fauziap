import { portfolioService } from "@/services/portfolio";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await portfolioService.getProfile();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Profile"
        description="Kelola identitas utama yang dipakai Hero, About, Contact, dan Resume."
      />
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
            {profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center px-8 text-center text-sm text-gray-500">
                Foto profil belum tersedia.
              </div>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Current Profile Data</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Nama Lengkap" value={profile?.fullName} />
            <Field label="Headline" value={profile?.title} />
            <Field label="Lokasi" value={profile?.location} />
            <Field label="GitHub" value={profile?.githubUrl} />
            <Field label="LinkedIn" value={profile?.linkedinUrl} />
            <Field label="Website" value={profile?.websiteUrl} />
            <Field label="Resume" value={profile?.resumeUrl} />
            <Field label="Short Bio" value={profile?.shortBio} wide />
            <Field label="Full Bio" value={profile?.fullBio} wide />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, wide }: { label: string; value?: string | null; wide?: boolean }) {
  return (
    <div className={wide ? "md:col-span-2" : undefined}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">{label}</p>
      <p className="mt-2 min-h-10 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
        {value ?? "Belum diisi"}
      </p>
    </div>
  );
}
