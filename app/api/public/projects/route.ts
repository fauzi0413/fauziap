import { portfolioService } from "@/services/portfolio";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "9");
  const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  const projects = await portfolioService.getProjects({
    query: searchParams.get("q") ?? undefined,
    technology: searchParams.get("technology") ?? undefined,
    sort,
    page,
    pageSize,
  });

  return Response.json({ data: projects });
}
