import type { Metadata } from "next";
import { MapPin, ArrowUpRight, FolderGit2 } from "lucide-react";
import Link from "next/link";
import { portfolioService } from "@/services/portfolio";
import { siteSettingService } from "@/services/site-setting";
import { convertGoogleDriveUrl } from "@/utils/media";
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
  const [profile, skills, experiences, educations, settings] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getSkills(),
    portfolioService.getExperiences({ isFeatured: true }),
    portfolioService.getEducations(),
    siteSettingService.getSetting(),
  ]);

  return (
    <PublicShell profile={profile} settings={settings}>
      <main>
        <PageHeader
          eyebrow="About"
          title={
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
              <span>{profile?.fullName ?? "Profil belum tersedia"}</span>
              <span>|</span>
              {profile?.title && (
                <span className="text-2xl md:text-5xl text-emerald-600/90 font-medium tracking-normal">{profile.title}</span>
              )}
            </div>
          }
          description={profile?.shortBio ?? "Lengkapi tabel Profile untuk menampilkan ringkasan diri."}
        >
          {profile?.location && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-black/55">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                {profile.location}
              </span>
            </div>
          )}
        </PageHeader>
        <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 md:grid-cols-[0.78fr_1.22fr]">
          <div className="overflow-hidden rounded-lg border border-black/10 bg-white p-3 shadow-sm self-start sticky top-28">
            <div className="aspect-[4/5] overflow-hidden rounded-md bg-black/[0.04]">
              {profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={convertGoogleDriveUrl(profile.avatarUrl)} alt={profile.fullName} className="h-full w-full object-cover" />
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
            <Panel title="Education History">
              {educations.map((education) => (
                <div key={education.id} className="border-b border-black/10 py-4 last:border-b-0 flex gap-4">
                  {education.institutionLogo ? (
                    <div className="shrink-0 h-12 w-12 overflow-hidden rounded-md border border-black/10 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={education.institutionLogo} alt={education.institution} className="h-full w-full object-cover p-1" />
                    </div>
                  ) : (
                    <div className="shrink-0 h-12 w-12 rounded-md bg-black/5 flex items-center justify-center border border-black/10">
                       <span className="text-xs font-bold text-black/40">{education.institution.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{education.institution} | {[education.degree, education.major].filter(Boolean).join(" - ")}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/55 font-medium">
                      <span>{formatPeriod(education.startDate, education.endDate)}</span>
                      {education.gpa && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-black/20" />
                          <span>GPA: {education.gpa}</span>
                        </>
                      )}
                    </div>
                    {education.projects && education.projects.length > 0 ? (
                      <div className="mt-4">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-black/40">Latest Project</p>
                        <Link href={`/projects/${education.projects[0].slug}`} className="inline-flex max-w-full items-center gap-2 rounded-md border border-black/10 bg-black/5 px-3 py-2 transition hover:bg-black/10 group">
                          <FolderGit2 className="h-4 w-4 shrink-0 text-black/40" />
                          <span className="truncate text-sm font-semibold text-black/80 group-hover:text-black">
                            {education.projects[0].title}
                          </span>
                        </Link>
                      </div>
                    ) : null}
                    
                    <Link href={`/education#${education.id}`} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-black/60 transition hover:text-black">
                      Lihat lebih lengkap <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
              {educations.length === 0 ? (
                <EmptyState title="Belum ada education" description="Data Education akan tampil otomatis." />
              ) : null}
            </Panel>
            <Panel title="Hard Skill">
              {skills.filter(s => s.type === "HARD").length > 0 ? (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {skills.filter(s => s.type === "HARD").map((skill) => {
                      const levelBorder = skill.level === "Expert" ? "border-purple-500" 
                                        : skill.level === "Advanced" ? "border-orange-500"
                                        : skill.level === "Intermediate" ? "border-yellow-500"
                                        : skill.level === "Elementary" ? "border-blue-500"
                                        : skill.level === "Beginner" ? "border-gray-500"
                                        : "border-transparent";
                      return (
                        <span key={skill.id} className={`inline-flex items-center gap-2 rounded-md bg-black/[0.06] px-3 py-2 text-sm font-semibold border-l-4 ${levelBorder}`}>
                          {skill.technology?.icon && skill.technology.icon.startsWith("http") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={skill.technology.icon} alt={skill.technology?.name ?? ""} className="h-5 w-5 object-contain" />
                          ) : (
                            skill.technology?.icon ? <span>{skill.technology?.icon}</span> : null
                          )}
                          <span>{skill.technology?.name}</span>
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-xs font-medium text-black/50">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-gray-500"></span> Beginner</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-blue-500"></span> Elementary</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-yellow-500"></span> Intermediate</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-orange-500"></span> Advanced</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-purple-500"></span> Expert</span>
                  </div>
                </div>
              ) : (
                <EmptyState title="Belum ada Hard Skill" description="Tambahkan data Hard Skill melalui dashboard admin." />
              )}
            </Panel>
            <Panel title="Soft Skill">
              {skills.filter(s => s.type === "SOFT").length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.filter(s => s.type === "SOFT").map((skill) => (
                    <span key={skill.id} className="rounded-md border border-black/10 px-3 py-2 text-sm font-medium">
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState title="Belum ada Soft Skill" description="Tambahkan data Soft Skill melalui dashboard admin." />
              )}
            </Panel>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <Panel title="Featured Experience">
            {experiences.map((experience) => (
              <div key={experience.id} className="border-b border-black/10 py-3 last:border-b-0 flex items-start gap-3">
                {experience.companyLogo && experience.companyLogo.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={experience.companyLogo} alt={experience.company} className="mt-0.5 h-5 w-5 shrink-0 object-contain" />
                ) : (
                  experience.companyLogo ? <span className="mt-0.5 shrink-0">{experience.companyLogo}</span> : null
                )}
                <div>
                  <p className="font-semibold">{experience.title} <span className="font-normal">di {experience.company}</span></p>
                  <p className="mt-1 text-xs text-black/45">
                    {formatPeriod(experience.startDate, experience.endDate, experience.isCurrent)}
                  </p>
                </div>
              </div>
            ))}
            {experiences.length === 0 ? (
              <EmptyState title="Belum ada experience" description="Data Experience akan tampil otomatis." />
            ) : (
              <div className="mt-4 pt-3 border-t border-black/5">
                <Link href="/experience" className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Lihat lainnya <span className="ml-1 opacity-70">→</span>
                </Link>
              </div>
            )}
          </Panel>
        </section>
      </main>
    </PublicShell>
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
