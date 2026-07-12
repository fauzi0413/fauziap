import type { Metadata } from "next";
import Link from "next/link";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/public/PageHeader";
import { ProjectCard } from "@/components/public/ProjectCard";
import { PublicShell } from "@/components/public/PublicShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Daftar project portfolio yang diambil dari database.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = value(params.q);
  const technology = value(params.technology);
  const sort = value(params.sort) === "oldest" ? "oldest" : "newest";
  const page = Number(value(params.page) ?? "1");
  const [profile, technologies, projects] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getTechnologies({ hasProject: true }),
    portfolioService.getProjects({ query, technology, sort, page }),
  ]);

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader
          eyebrow="Projects"
          title="Case study dan project yang pernah dikerjakan."
          description="Gunakan pencarian, filter teknologi, sorting, dan pagination untuk menelusuri project."
        />
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <form className="grid gap-3 rounded-lg border border-black/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_160px_auto]">
            <input name="q" defaultValue={query} placeholder="Cari project..." className="h-11 rounded-md border border-black/10 px-3 outline-none focus:border-black" />
            <select name="technology" defaultValue={technology} className="h-11 rounded-md border border-black/10 px-3 outline-none focus:border-black">
              <option value="">Semua teknologi</option>
              {technologies.map((item) => (
                <option key={item.id} value={item.slug}>{item.name}</option>
              ))}
            </select>
            <select name="sort" defaultValue={sort} className="h-11 rounded-md border border-black/10 px-3 outline-none focus:border-black">
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
            <button className="h-11 rounded-md bg-black px-5 text-sm font-semibold text-white">Filter</button>
          </form>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {projects.items.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
          {projects.items.length === 0 ? (
            <div className="mt-8">
              <EmptyState title="Project tidak ditemukan" description="Coba ubah pencarian atau tambahkan data Project melalui dashboard." />
            </div>
          ) : null}
          <div className="mt-8 flex items-center justify-between text-sm font-semibold">
            <span>Page {projects.page} of {projects.totalPages}</span>
            <div className="flex gap-2">
              {projects.page > 1 ? <Link href={pageHref(params, projects.page - 1)} className="rounded-md border border-black/10 px-4 py-2">Previous</Link> : null}
              {projects.page < projects.totalPages ? <Link href={pageHref(params, projects.page + 1)} className="rounded-md border border-black/10 px-4 py-2">Next</Link> : null}
            </div>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

function value(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] : input;
}

function pageHref(params: Record<string, string | string[] | undefined>, page: number) {
  const search = new URLSearchParams();
  for (const [key, raw] of Object.entries(params)) {
    const current = value(raw);
    if (current && key !== "page") search.set(key, current);
  }
  search.set("page", String(page));
  return `/projects?${search.toString()}`;
}
