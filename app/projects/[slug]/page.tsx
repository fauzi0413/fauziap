import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
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
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">Case Study</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">{project.title}</h1>
          {project.shortDescription ? <p className="mt-5 max-w-3xl text-lg leading-8 text-black/58">{project.shortDescription}</p> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {project.repositoryUrl ? <a href={project.repositoryUrl} className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white">GitHub <ArrowUpRight className="h-4 w-4" /></a> : null}
            {project.demoUrl ? <a href={project.demoUrl} className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold">Live Demo <ArrowUpRight className="h-4 w-4" /></a> : null}
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 md:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-4">
            <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Technology Stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map(({ technology }) => (
                  <span key={technology.id} className="rounded-md bg-black/[0.06] px-3 py-2 text-sm font-semibold">{technology.name}</span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Created</h2>
              <p className="mt-2 text-sm text-black/60">{project.createdAt.toLocaleDateString("id-ID")}</p>
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
          {project.images.length === 0 ? <EmptyState title="Gallery belum tersedia" description="Tambahkan ProjectImage melalui dashboard." /> : null}
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
      <p className="mt-3 whitespace-pre-line leading-8 text-black/62">{content ?? "Belum diisi."}</p>
    </section>
  );
}
