import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "6");

  const blogs = await portfolioService.getBlogs({
    query: searchParams.get("q") ?? undefined,
    page,
    pageSize,
  });

  return Response.json({ data: blogs });
}
