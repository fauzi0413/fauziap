import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await portfolioService.getFeaturedProjects();
  return Response.json({ data: projects });
}
