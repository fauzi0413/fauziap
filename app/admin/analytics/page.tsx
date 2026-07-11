import { analyticsService } from "@/services/analytics";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [kpi, dailyVisits, topStats, recentLogs] = await Promise.all([
    analyticsService.getKPIs(),
    analyticsService.getDailyVisitsLast30Days(),
    analyticsService.getTopStats(),
    analyticsService.getRecentLog(15),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Visitor Analytics"
        description="Lihat kunjungan website, halaman yang dibuka, perangkat, lokasi, browser, dan referer secara real-time."
      />
      <AnalyticsDashboard
        kpi={kpi}
        dailyVisits={dailyVisits}
        topStats={topStats}
        recentLogs={recentLogs}
      />
    </div>
  );
}
