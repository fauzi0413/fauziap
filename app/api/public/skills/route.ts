import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const skills = await portfolioService.getSkills();
  return Response.json({ data: skills });
}
