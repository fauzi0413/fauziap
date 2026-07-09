import { z } from "zod";
import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid contact payload" }, { status: 422 });
  }

  const message = await portfolioService.createContactMessage(parsed.data);
  return Response.json({ data: message }, { status: 201 });
}
