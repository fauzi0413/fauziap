import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const certificates = await portfolioService.getCertificates();
  return Response.json({ data: certificates });
}
