import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const educations = await portfolioService.getEducations();
  return Response.json({ data: educations });
}
