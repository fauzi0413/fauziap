import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const experiences = await portfolioService.getExperiences();
  return Response.json({ data: experiences });
}
