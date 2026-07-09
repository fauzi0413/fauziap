import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteContext<"/api/public/projects/[slug]">) {
  const { slug } = await context.params;
  const project = await portfolioService.getProjectBySlug(slug);

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  const relatedProjects = await portfolioService.getRelatedProjects(
    project.id,
    project.technologies.map((item) => item.technologyId),
  );

  return Response.json({ data: { project, relatedProjects } });
}
