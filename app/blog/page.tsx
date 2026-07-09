import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";
import { readingTime } from "@/components/public/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artikel teknis dan catatan pengembangan aplikasi.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = value(params.q);
  const page = Number(value(params.page) ?? "1");
  const [profile, blogs] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getBlogs({ query, page }),
  ]);

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader eyebrow="Blog" title="Catatan teknis dan pembelajaran." description="Artikel terbit ditarik dari tabel Blog dengan estimasi waktu baca." />
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <form className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
            <input name="q" defaultValue={query} placeholder="Cari artikel..." className="h-11 w-full rounded-md border border-black/10 px-3 outline-none focus:border-black" />
          </form>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {blogs.items.map((blog) => (
              <article key={blog.id} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/35">{readingTime(blog.content)} min read</p>
                <h2 className="mt-3 text-xl font-semibold">{blog.title}</h2>
                {blog.excerpt ? <p className="mt-3 min-h-16 text-sm leading-6 text-black/58">{blog.excerpt}</p> : null}
                <Link href={`/blog/${blog.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  Baca artikel
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
          {blogs.items.length === 0 ? <EmptyState title="Blog belum tersedia" description="Artikel dengan isPublished true akan tampil di sini." /> : null}
        </section>
      </main>
    </PublicShell>
  );
}

function value(input: string | string[] | undefined) {
  return Array.isArray(input) ? input[0] : input;
}
