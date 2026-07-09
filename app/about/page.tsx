import type { Metadata } from "next";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";
import { formatPeriod } from "@/components/public/format";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await portfolioService.getProfile();

  return {
    title: profile ? `About ${profile.fullName}` : "About",
    description: profile?.shortBio ?? "Halaman about personal portfolio.",
  };
}

export default async function AboutPage() {
  const [profile, skills, experiences, educations] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getSkills(),
    portfolioService.getExperiences(),
    portfolioService.getEducations(),
  ]);

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader
          eyebrow="About"
          title={profile?.fullName ?? "Profil belum tersedia"}
          description={profile?.shortBio ?? "Lengkapi tabel Profile untuk menampilkan ringkasan diri."}
        />
        <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 md:grid-cols-[0.78fr_1.22fr]">
          <div className="overflow-hidden rounded-lg border border-black/10 bg-white p-3 shadow-sm">
            <div className="aspect-[4/5] overflow-hidden rounded-md bg-black/[0.04]">
              {profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-8 text-center text-sm text-black/40">
                  Foto profil belum tersedia.
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Full Bio</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-black/62">
                {profile?.fullBio ?? "Field fullBio pada tabel Profile belum diisi."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Profesi" value={profile?.title} />
              <Info label="Lokasi" value={profile?.location} />
              <Info label="Website" value={profile?.websiteUrl} />
              <Info label="LinkedIn" value={profile?.linkedinUrl} />
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 md:grid-cols-3">
          <Panel title="Hard Skill">
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="rounded-md bg-black/[0.06] px-3 py-2 text-sm font-semibold">
                    {skill.technology.name}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada skill" description="Tambahkan data Skill melalui dashboard admin." />
            )}
          </Panel>
          <Panel title="Experience Preview">
            {experiences.slice(0, 2).map((experience) => (
              <div key={experience.id} className="border-b border-black/10 py-3 last:border-b-0">
                <p className="font-semibold">{experience.title}</p>
                <p className="text-sm text-black/55">{experience.company}</p>
                <p className="mt-1 text-xs text-black/45">
                  {formatPeriod(experience.startDate, experience.endDate, experience.isCurrent)}
                </p>
              </div>
            ))}
            {experiences.length === 0 ? (
              <EmptyState title="Belum ada experience" description="Data Experience akan tampil otomatis." />
            ) : null}
          </Panel>
          <Panel title="Education Preview">
            {educations.slice(0, 2).map((education) => (
              <div key={education.id} className="border-b border-black/10 py-3 last:border-b-0">
                <p className="font-semibold">{education.institution}</p>
                <p className="text-sm text-black/55">{[education.degree, education.major].filter(Boolean).join(" - ")}</p>
                <p className="mt-1 text-xs text-black/45">{formatPeriod(education.startDate, education.endDate)}</p>
              </div>
            ))}
            {educations.length === 0 ? (
              <EmptyState title="Belum ada education" description="Data Education akan tampil otomatis." />
            ) : null}
          </Panel>
        </section>
      </main>
    </PublicShell>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">{label}</p>
      <p className="mt-2 break-words font-semibold">{value ?? "Belum diisi"}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
