import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteContext<"/api/public/blog/[slug]">) {
  const { slug } = await context.params;
  const blog = await portfolioService.getBlogBySlug(slug);

  if (!blog || !blog.isPublished) {
    return Response.json({ error: "Blog not found" }, { status: 404 });
  }

  const relatedBlogs = await portfolioService.getRelatedBlogs(blog.slug);
  return Response.json({ data: { blog, relatedBlogs } });
}
