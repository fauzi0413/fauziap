import Link from "next/link";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, MapPin, Radio } from "lucide-react";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { MotionReveal } from "@/components/public/MotionReveal";
import { ProjectCard } from "@/components/public/ProjectCard";
import { PublicShell } from "@/components/public/PublicShell";

export const dynamic = "force-dynamic";

export async function PortfolioPage() {
  const [profile, skills, projects] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getSkills(),
    portfolioService.getFeaturedProjects(),
  ]);

  return (
    <PublicShell profile={profile}>
      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-24">
          <MotionReveal>
            <div className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black/60 shadow-sm">
              <Radio className="h-4 w-4 text-emerald-600" />
              {profile?.title ?? "Profile belum diisi"}
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl">
              {profile?.fullName ?? "Lengkapi profil untuk menampilkan nama Anda"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
              {profile?.shortBio ?? "Data ringkasan profil akan tampil dari field shortBio."}
            </p>
            {profile?.location ? (
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium text-black/55">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
              </div>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80"
              >
                Lihat Project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-5 text-sm font-semibold transition hover:border-black/30"
              >
                Hubungi Saya
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              {profile?.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-5 text-sm font-semibold transition hover:border-black/30"
                >
                  Download Resume
                  <ArrowDownToLine className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </MotionReveal>

          <MotionReveal className="relative">
            <div className="overflow-hidden rounded-lg border border-black/10 bg-white p-3 shadow-2xl shadow-black/10">
              <div className="aspect-[4/5] overflow-hidden rounded-md bg-black/[0.04]">
                {profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center px-8 text-center text-sm font-medium text-black/40">
                    Foto profesional dari Profile.avatarUrl akan tampil di sini.
                  </div>
                )}
              </div>
            </div>
          </MotionReveal>
        </section>

        <section className="border-y border-black/10 bg-white/65">
          <div className="mx-auto max-w-7xl px-5 py-10">
            <div className="flex flex-wrap gap-3">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-semibold shadow-sm"
                  >
                    {skill.technology.icon ? `${skill.technology.icon} ` : ""}
                    {skill.technology.name}
                    {skill.level ? <span className="ml-2 text-black/45">{skill.level}</span> : null}
                  </span>
                ))
              ) : (
                <div className="w-full">
                  <EmptyState
                    title="Skill belum tersedia"
                    description="Tambahkan Technology dan Skill dari dashboard admin agar badge teknologi tampil otomatis di halaman publik."
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">About preview</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Ringkasan profil profesional.</h2>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <p className="leading-8 text-black/62">
              {profile?.shortBio ?? "Field shortBio pada tabel Profile belum diisi."}
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
              Baca About lengkap
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="bg-black text-white">
          <div className="mx-auto max-w-7xl px-5 py-16">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">Featured projects</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                  Project terbaru yang ditarik langsung dari database.
                </h2>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold">
                Semua project
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {projects.length > 0 ? (
                projects.map((project) => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="md:col-span-3">
                  <EmptyState
                    title="Project belum tersedia"
                    description="Tambahkan data Project dari dashboard admin agar section ini otomatis terisi."
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
