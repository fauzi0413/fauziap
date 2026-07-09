import { z } from "zod";
import { technologyService } from "@/services/technology";

export const dynamic = "force-dynamic";

const technologySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  icon: z.string().optional(),
});

export async function GET(_request: Request, context: RouteContext<"/api/admin/technologies/[id]">) {
  const { id } = await context.params;
  const technology = await technologyService.getById(id);

  if (!technology) {
    return Response.json({ error: "Technology not found" }, { status: 404 });
  }

  return Response.json({ data: technology });
}

export async function PATCH(request: Request, context: RouteContext<"/api/admin/technologies/[id]">) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = technologySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid technology payload" }, { status: 422 });
  }

  const technology = await technologyService.update(id, parsed.data);
  return Response.json({ data: technology });
}

export async function DELETE(_request: Request, context: RouteContext<"/api/admin/technologies/[id]">) {
  const { id } = await context.params;
  await technologyService.delete(id);
  return Response.json({ success: true });
}
