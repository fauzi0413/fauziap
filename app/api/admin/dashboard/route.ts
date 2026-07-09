import { adminService } from "@/services/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const [stats, activity] = await Promise.all([
    adminService.getDashboardStats(),
    adminService.getRecentActivity(),
  ]);

  return Response.json({ data: { stats, activity } });
}
