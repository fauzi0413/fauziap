import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await portfolioService.getProfile();
  return Response.json({ data: profile });
}
