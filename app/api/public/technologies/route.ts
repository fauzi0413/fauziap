import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const technologies = await portfolioService.getTechnologies();
  return Response.json({ data: technologies });
}
