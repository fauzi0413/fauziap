import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { PublicShell } from "@/components/public/PublicShell";
import { readingTime } from "@/components/public/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await portfolioService.getBlogBySlug(slug);

  return {
    title: blog?.title ?? "Blog Detail",
    description: blog?.excerpt ?? "Artikel blog portfolio.",
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await portfolioService.getBlogBySlug(slug);
  if (!blog || !blog.isPublished) notFound();

  const [profile, relatedBlogs] = await Promise.all([
    portfolioService.getProfile(),
    portfolioService.getRelatedBlogs(blog.slug),
  ]);

  return (
    <PublicShell profile={profile}>
      <main>
        <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">{readingTime(blog.content)} min read</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{blog.title}</h1>
          {blog.excerpt ? <p className="mt-5 text-lg leading-8 text-black/58">{blog.excerpt}</p> : null}
          {blog.coverImage ? (
            <div className="mt-8 overflow-hidden rounded-lg border border-black/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={blog.coverImage} alt={blog.title} className="aspect-[16/9] w-full object-cover" />
            </div>
          ) : null}
          <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line leading-8 text-black/70">
            {blog.content}
          </div>
        </article>
        <section className="mx-auto max-w-5xl px-5 pb-16">
          <h2 className="text-2xl font-semibold">Related Article</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {relatedBlogs.map((item) => (
              <Link key={item.id} href={`/blog/${item.slug}`} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">Baca <ArrowUpRight className="h-4 w-4" /></p>
              </Link>
            ))}
          </div>
          {relatedBlogs.length === 0 ? <EmptyState title="Belum ada related article" description="Artikel terkait akan muncul saat ada artikel lain yang published." /> : null}
        </section>
      </main>
    </PublicShell>
  );
}
