import { z } from "zod";
import { technologyService } from "@/services/technology";

export const dynamic = "force-dynamic";

const technologySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  icon: z.string().optional(),
});

export async function GET() {
  const technologies = await technologyService.getAll();
  return Response.json({ data: technologies });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = technologySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid technology payload" }, { status: 422 });
  }

  const technology = await technologyService.create(parsed.data);
  return Response.json({ data: technology }, { status: 201 });
}
