import type { MetadataRoute } from "next";
import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, blogs] = await Promise.all([
    portfolioService.getProjects({ pageSize: 100 }),
    portfolioService.getBlogs({ pageSize: 100 }),
  ]);

  const staticRoutes = ["", "/about", "/projects", "/experience", "/education", "/certificates", "/research", "/blog", "/contact", "/resume"];

  return [
    ...staticRoutes.map((route) => ({ url: route || "/" })),
    ...projects.items.map((project) => ({ url: `/projects/${project.slug}`, lastModified: project.updatedAt })),
    ...blogs.items.map((blog) => ({ url: `/blog/${blog.slug}`, lastModified: blog.updatedAt })),
  ];
}
