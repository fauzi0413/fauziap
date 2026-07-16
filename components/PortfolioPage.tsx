import Link from "next/link";
import { portfolioService } from "@/services/portfolio";
import { researchService } from "@/services/research";
import { convertGoogleDriveUrl } from "@/utils/media";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, MapPin, Radio, GraduationCap, Award, Microscope, Blocks, FileText } from "lucide-react";
import { siteSettingService } from "@/services/site-setting";
import { CvModal } from "@/components/public/CvModal";
import { ContactModal } from "@/components/public/ContactModal";
import { EmptyState } from "@/components/public/EmptyState";
import { MotionReveal } from "@/components/public/MotionReveal";
import { ProjectCard } from "@/components/public/ProjectCard";
import { PublicShell } from "@/components/public/PublicShell";

export const dynamic = "force-dynamic";

export async function PortfolioPage() {
  const [profile, skills, projects, certificates, settings, educations, researches] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getSkills(),
    portfolioService.getFeaturedProjects(),
    portfolioService.getCertificates(),
    siteSettingService.getSetting(),
    portfolioService.getEducations(),
    researchService.getAll({ isPublic: true }),
  ]);

  const latestEducation = educations && educations.length > 0 ? educations[0] : null;

  return (
    <PublicShell profile={profile} settings={settings}>
      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-24">
          <MotionReveal>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black/60 shadow-sm">
                <Radio className="h-4 w-4 text-emerald-600" />
                {profile?.title ?? "Profile belum diisi"}
              </div>
              {latestEducation && (
                <div className="inline-flex items-center gap-2.5 rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black/60 shadow-sm">
                  {latestEducation.institutionLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={latestEducation.institutionLogo} alt={latestEducation.institution} className="h-4 w-4 object-contain" />
                  ) : (
                    <GraduationCap className="h-4 w-4 text-black/40" />
                  )}
                  <span>
                    <span className="font-semibold text-black/80">{latestEducation.institution}</span>
                    {[latestEducation.degree, latestEducation.major].filter(Boolean).length > 0 && (
                        <span className="font-normal text-black/55">
                          {" · "}
                          {[latestEducation.degree, latestEducation.major].filter(Boolean).join(" ")}
                        </span>
                    )}
                  </span>
                </div>
              )}
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight md:text-7xl">
              {profile?.fullName ?? "Lengkapi profil untuk menampilkan nama Anda"}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
              Selamat datang di ruang lingkup digital saya. Silakan jelajahi berbagai karya, rutinitas project, dan riwayat profesional saya di sini.
            </p>
            {profile?.location ? (
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium text-black/55">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
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
              <ContactModal profile={profile}>
                <button
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-5 text-sm font-semibold transition hover:border-black/30"
                >
                  Mari Berkoneksi
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </ContactModal>
            </div>
          </MotionReveal>

          <MotionReveal className="relative">
            <div className="overflow-hidden rounded-lg border border-black/10 bg-white p-3 shadow-2xl shadow-black/10">
              <div className="aspect-[4/5] overflow-hidden rounded-md bg-black/[0.04]">
                {profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={convertGoogleDriveUrl(profile.avatarUrl)} alt={profile.fullName} className="h-full w-full object-cover" />
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
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              {skills.filter(s => s.type === "HARD" && s.technology).length > 0 ? (
                skills.filter(s => s.type === "HARD" && s.technology).map((skill) => {
                  const tech = skill.technology!;
                  return (
                  <span
                    key={skill.id}
                    className="flex items-center rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-semibold shadow-sm"
                  >
                    {tech.icon && tech.icon.startsWith("http") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tech.icon} alt={tech.name} className="mr-2 h-5 w-5 object-contain" />
                    ) : (
                      tech.icon ? <span className="mr-2">{tech.icon}</span> : null
                    )}
                    {tech.name}
                  </span>
                )})
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
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">Sekilas Tentang</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Ringkasan profil profesional.</h2>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <p className="leading-8 text-black/62 text-justify">
              {profile?.shortBio ?? "Field shortBio pada tabel Profile belum diisi."}
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
              Baca profil lengkap
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="bg-black text-white">
          <div className="mx-auto max-w-7xl px-5 py-16">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">Project Terbaru</p>
                <h6 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                  Dokumentasi teknis dari berbagai solusi dan arsitektur sistem yang telah saya kembangkan.
                </h6>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold">
                Semua Project
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

        {/* Certificates Section */}
        <section className="bg-[#f7f7f4]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">Sertifikasi</p>
                <h6 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl text-black">
                  Validasi keahlian teknis dan pembelajaran berkelanjutan.
                </h6>
              </div>
              <Link href="/certificates" className="inline-flex items-center gap-2 text-sm font-semibold text-black transition hover:text-black/70">
                Semua Sertifikat
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="mt-10 flex flex-col gap-6">
              {certificates.length > 0 ? (
                certificates.slice(0, 4).map((cert) => (
                  <article key={cert.id} className="flex gap-4 border-b border-black/10 pb-6 rounded transition hover:bg-black/[0.02] p-4 last:border-0">
                    <div className="shrink-0 mt-1">
                      {cert.issuerLogo ? (
                        <div className="h-12 w-12 overflow-hidden bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={cert.issuerLogo} alt={cert.issuer} className="h-full w-full object-contain border border-black/10 rounded-sm bg-black/5" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-black/5 border border-black/10">
                          <Award className="h-6 w-6 text-black/40" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <h3 className="text-[17px] font-semibold text-gray-900 leading-snug">
                        {cert.name}
                      </h3>
                      <p className="mt-0.5 text-[15px] text-gray-900">{cert.issuer}</p>
                      <p className="max-w-md mt-0.5 text-[14px] text-black/60 font-medium">
                        Dikeluarkan {cert.issueDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                        {cert.expiryDate ? ` · Berakhir ${cert.expiryDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}` : ""}
                      </p>
                      
                      {cert.credentialId && (
                        <p className="mt-0.5 text-[14px] text-black/60 font-medium">ID Kredensial {cert.credentialId}</p>
                      )}
                      
                      {cert.credentialUrl && (
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex max-w-fit items-center gap-2 rounded-full border border-black/40 bg-transparent px-4 py-1.5 text-[14px] font-semibold text-black/75 transition hover:bg-black/5 hover:text-black hover:border-black/60"
                        >
                          Tampilkan kredensial
                          <ArrowUpRight className="h-4 w-4 opacity-60" />
                        </a>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="md:col-span-3">
                  <EmptyState
                    title="Certificate belum tersedia"
                    description="Tambahkan data Certificate dari dashboard admin."
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Research Section */}
        {researches.length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">Riset & Publikasi</p>
                  <h6 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl text-black">
                    Eksplorasi penelitian dan dataset yang telah dipublikasikan.
                  </h6>
                </div>
                <Link href="/research" className="inline-flex items-center gap-2 text-sm font-semibold text-black transition hover:text-black/70">
                  Semua Publikasi
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="mt-10 flex flex-col gap-6">
                {researches.slice(0, 3).map((item) => (
                  <article key={item.id} className="flex gap-4 border-b border-black/10 pb-6 rounded transition hover:bg-black/[0.02] p-4 last:border-0">
                    <div className="shrink-0 mt-1">
                      {item.image ? (
                        <div className="h-12 w-12 overflow-hidden bg-white">
                          <img src={item.image} alt="Thumbnail" className="h-full w-full object-cover border border-black/10 rounded-sm bg-black/5" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30">
                          {item.category === "DATASET" ? (
                            <Blocks className="h-6 w-6 text-blue-500" />
                          ) : (
                            <FileText className="h-6 w-6 text-blue-500" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <h3 className="text-[17px] font-semibold text-gray-900 leading-snug">
                        {item.title}
                      </h3>
                      {item.authors && (
                        <p className="mt-0.5 text-[15px] text-gray-900">{item.authors}</p>
                      )}
                      <p className="mt-0.5 text-[14px] text-black/60 font-medium">
                        <span className="inline-flex rounded bg-blue-50 px-1 py-0.5 text-[10px] font-bold tracking-wider text-blue-600 mr-2 uppercase">
                          {item.category}
                        </span>
                        Diterbitkan oleh {item.publisher} pada {item.publishDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                      </p>
                      
                      {item.description && (
                        <p className="mt-2 text-[14px] text-black/70 leading-relaxed text-justify">
                          <span className="text-black font-bold">Abstrak - </span>
                          {item.description}
                        </p>
                      )}
                      
                      {item.url && (
                        <a 
                          href={item.url} 
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex max-w-fit items-center gap-2 rounded-full border border-black/40 bg-transparent px-4 py-1.5 text-[14px] font-semibold text-black/75 transition hover:bg-black/5 hover:text-black hover:border-black/60"
                        >
                          Lihat publikasi
                          <ArrowUpRight className="h-4 w-4 opacity-60" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </PublicShell>
  );
}
