import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Globe, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { ProjectCard } from "@/components/public/ProjectCard";
import { PublicShell } from "@/components/public/PublicShell";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await portfolioService.getProjectBySlug(slug);

  return {
    title: project?.title ?? "Project Detail",
    description: project?.shortDescription ?? "Detail project portfolio.",
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await portfolioService.getProjectBySlug(slug);
  if (!project) notFound();

  const [profile, relatedProjects] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getRelatedProjects(project.id, project.technologies.map((item) => item.technologyId)),
  ]);

  return (
    <PublicShell profile={profile}>
      <main>
        <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <Link href="/projects" className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-black/50 transition hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Semua Project
          </Link>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">Case Study</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">{project.title}</h1>
              {project.shortDescription ? <p className="mt-5 text-lg leading-8 text-black/58 text-justify">{project.shortDescription}</p> : null}

              {(project.experience || project.education) && (
                <div className="mt-6 flex flex-col gap-2">
                  {project.experience && (
                    <Link href={`/experience#${project.experience.id}`} className="inline-flex max-w-fit items-start sm:items-center gap-3 sm:gap-2 rounded-xl sm:rounded-full border border-black/10 bg-black/5 px-4 py-3 sm:py-2 text-sm font-medium text-black/75 transition hover:bg-black/10">
                      <BriefcaseBusiness className="h-4 w-4 shrink-0 mt-0.5 sm:mt-0 opacity-60" />
                      <span className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
                        <span>Dikerjakan saat berada di</span>
                        <span className="font-semibold text-black hover:underline">{project.experience.company}</span>
                      </span>
                    </Link>
                  )}
                  {project.education && (
                    <Link href={`/education#${project.education.id}`} className="inline-flex max-w-fit items-start sm:items-center gap-3 sm:gap-2 rounded-xl sm:rounded-full border border-black/10 bg-black/5 px-4 py-3 sm:py-2 text-sm font-medium text-black/75 transition hover:bg-black/10">
                      <GraduationCap className="h-4 w-4 shrink-0 mt-0.5 sm:mt-0 opacity-60" />
                      <span className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
                        <span>Projek selama masa studi di</span>
                        <span className="font-semibold text-black hover:underline">
                          {[project.education.degree, project.education.major].filter(Boolean).length > 0 ? 
                            `${[project.education.degree, project.education.major].filter(Boolean).join(" ")} · ${project.education.institution}` : 
                            project.education.institution}
                        </span>
                      </span>
                    </Link>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {project.repositoryUrl ? (
                  project.repositoryUrl.split(",").map((item, idx) => {
                    const cleanItem = item.trim();
                    if (!cleanItem) return null;
                    
                    let label = "";
                    let url = cleanItem;

                    if (cleanItem.includes("|")) {
                      const parts = cleanItem.split("|");
                      label = parts[0].trim();
                      url = parts[1].trim();
                    }
                    
                    if (!label) {
                       const repoName = url.split("/").pop() || "GitHub";
                       label = project.repositoryUrl!.includes(",") ? repoName : "GitHub";
                    }

                    return (
                      <a key={`${url}-${idx}`} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80">
                        <FaGithub className="h-4 w-4" /> {label} <ArrowUpRight className="h-4 w-4 opacity-70" />
                      </a>
                    );
                  })
                ) : null}
                {project.demoUrl ? (
                  project.demoUrl.split(",").map((item, idx) => {
                    const cleanItem = item.trim();
                    if (!cleanItem) return null;

                    let label = "Live Demo";
                    let url = cleanItem;
                    
                    if (cleanItem.includes("|")) {
                      const parts = cleanItem.split("|");
                      label = parts[0].trim();
                      url = parts[1].trim();
                    }

                    return (
                      <a key={`${url}-${idx}`} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-black/5">
                        <Globe className="h-4 w-4" /> {label} <ArrowUpRight className="h-4 w-4 opacity-50" />
                      </a>
                    );
                  })
                ) : null}
              </div>
            </div>
            {(project.thumbnail || project.images?.[0]?.imageUrl) && (
              <div className="relative overflow-hidden rounded-xl border border-black/10 bg-black/5 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={project.thumbnail ?? project.images[0].imageUrl} 
                  alt={project.title} 
                  className="aspect-[16/10] w-full object-cover" 
                />
              </div>
            )}
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 md:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-4">
            <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Technology Stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {[...project.technologies].sort((a, b) => {
                  const orderA = a.technology.skills?.[0]?.displayOrder ?? 999;
                  const orderB = b.technology.skills?.[0]?.displayOrder ?? 999;
                  return orderA - orderB;
                }).map(({ technology }) => (
                  <span key={technology.id} className="inline-flex items-center gap-1.5 rounded-md bg-black/[0.06] px-3 py-2 text-sm font-semibold text-black/75">
                    {technology.icon && technology.icon.startsWith("http") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={technology.icon} alt={technology.name} className="h-4 w-4 object-contain" />
                    ) : (
                      technology.icon ? <span>{technology.icon}</span> : null
                    )}
                    <span>{technology.name}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Created</h2>
              <p className="mt-2 text-sm text-black/60">
                {project.createdAt.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </aside>
          <div className="space-y-5">
            <Section title="Overview" content={project.fullDescription} />
            <Section title="Background" content={project.background} />
            <Section title="Objectives" content={project.objectives} />
            <Section title="Solution" content={project.solutions} />
            <Section title="Architecture" content={project.architecture} />
            <Section title="Challenges" content={project.challenges} />
            <Section title="Lessons Learned" content={project.lessons} />
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <h2 className="text-2xl font-semibold">Gallery Screenshot</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {project.images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg border border-black/10 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.imageUrl} alt={image.altText ?? project.title} className="aspect-[16/10] w-full object-cover" />
              </div>
            ))}
          </div>
          {project.images.length === 0 ? <EmptyState title="Gallery belum terisi" description="Silahkan tambahkan gambar projek untuk melengkapi halaman ini." /> : null}
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold">Project Terkait</h2>
            <Link href="/projects" className="text-sm font-semibold">Lihat semua</Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {relatedProjects.map((item) => <ProjectCard key={item.id} project={item} />)}
          </div>
          {relatedProjects.length === 0 ? <EmptyState title="Belum ada project terkait" description="Project terkait akan muncul berdasarkan teknologi yang sama." /> : null}
        </section>
      </main>
    </PublicShell>
  );
}

function Section({ title, content }: { title: string; content?: string | null }) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 whitespace-pre-line leading-8 text-black/62 text-justify">{content ?? "Belum diisi."}</p>
    </section>
  );
}
