"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Users, Monitor, Globe2, Link2, MapPin } from "lucide-react";
import type { Visitor } from "@prisma/client";

interface ChartData { date: string; count: number }
interface TopStat { name: string; count: number }

interface DashboardProps {
  kpi: { todayCount: number; yesterdayCount: number; totalCount: number; trend: number };
  dailyVisits: ChartData[];
  topStats: {
    topPages: TopStat[];
    topBrowsers: TopStat[];
    topReferers: TopStat[];
    topCountries: TopStat[];
  };
  recentLogs: Visitor[];
}

export function AnalyticsDashboard({ kpi, dailyVisits, topStats, recentLogs }: DashboardProps) {
  // Hitung persentase bar chart
  const maxVisits = useMemo(() => {
    const max = Math.max(...dailyVisits.map((d) => d.count));
    return max > 0 ? max : 1; // hindari pembagian 0
  }, [dailyVisits]);

  const trendIsUp = kpi.trend >= 0;

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-sm font-medium text-gray-500">Pengunjung Hari Ini</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {kpi.todayCount.toLocaleString()}
            </span>
            <span
              className={`flex items-center text-xs font-semibold ${
                trendIsUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {trendIsUp ? <TrendingUp className="mr-0.5 h-3 w-3" /> : <TrendingDown className="mr-0.5 h-3 w-3" />}
              {Math.abs(kpi.trend)}% vs kemarin
            </span>
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-sm font-medium text-gray-500">Kemarin</p>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {kpi.yesterdayCount.toLocaleString()}
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-sm font-medium text-gray-500">Total Keseluruhan</p>
          <div className="mt-2 flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            <Users className="h-6 w-6 text-gray-400" />
            {kpi.totalCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ── 2. Daily Bar Chart (Native CSS) ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="mb-6 font-semibold text-gray-900 dark:text-white">Kunjungan Harian (30 Hari Terakhir)</h3>
        <div className="relative h-48 w-full">
          <div className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-2">
            {dailyVisits.map((d, i) => {
              const heightPct = (d.count / maxVisits) * 100;
              const isToday = i === dailyVisits.length - 1;
              const dateObj = new Date(d.date);
              
              return (
                <div key={d.date} className="group relative flex h-full flex-1 flex-col justify-end">
                  {/* Tooltip Hover */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-gray-950">
                    <span className="font-semibold">{d.count} views</span>
                    <br />
                    <span className="text-gray-400 dark:text-gray-500">
                      {dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-500 hover:bg-gray-800 dark:hover:bg-gray-400 ${
                      isToday ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-800"
                    }`}
                    style={{ height: `${heightPct}%`, minHeight: d.count > 0 ? "4px" : "0" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* X Axis labels */}
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>{new Date(dailyVisits[0].date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
          <span>Hari Ini</span>
        </div>
      </div>

      {/* ── 3. Top Stats Grid ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatList title="Top Pages" data={topStats.topPages} icon={<Monitor className="h-4 w-4" />} />
        <StatList title="Sumber (Referer)" data={topStats.topReferers} icon={<Link2 className="h-4 w-4" />} defaultEmpty="Direct / Lainnya" />
        <StatList title="Top Browsers" data={topStats.topBrowsers} icon={<Globe2 className="h-4 w-4" />} />
        <StatList title="Negara" data={topStats.topCountries} icon={<MapPin className="h-4 w-4" />} defaultEmpty="Unknown" />
      </div>

      {/* ── 4. Log Terbaru ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Log Pengunjung Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-400 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 font-medium">Waktu</th>
                <th className="px-6 py-3 font-medium">Halaman</th>
                <th className="px-6 py-3 font-medium">Browser / Device</th>
                <th className="px-6 py-3 font-medium">Lokasi</th>
                <th className="px-6 py-3 font-medium">IP / Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentLogs.map((log) => {
                const time = new Date(log.visitedAt).toLocaleString("id-ID", {
                  dateStyle: "short",
                  timeStyle: "short",
                });
                return (
                  <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-3 whitespace-nowrap">{time}</td>
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">{log.path || "/"}</td>
                    <td className="px-6 py-3">{log.browser || "Unknown"} · {log.device || "Desktop"}</td>
                    <td className="px-6 py-3">{log.city ? `${log.city}, ${log.country}` : log.country || "Unknown"}</td>
                    <td className="px-6 py-3 text-xs opacity-60">
                      <div className="truncate max-w-[150px]" title={log.ipAddress || ""}>{log.ipAddress || "Hidden"}</div>
                    </td>
                  </tr>
                );
              })}
              {recentLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center">Belum ada data terekam.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Komponen Pembantu (Stat List) ──
function StatList({ title, data, icon, defaultEmpty = "Unknown" }: { title: string, data: TopStat[], icon: React.ReactNode, defaultEmpty?: string }) {
  const totalInList = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-gray-400">Tidak ada data.</p>
        ) : (
          data.map((item, idx) => {
            const pct = Math.round((item.count / totalInList) * 100) || '<1';
            return (
              <div key={idx} className="group">
                <div className="flex justify-between text-sm">
                  <span className="truncate pr-2 font-medium text-gray-600 dark:text-gray-300">
                    {item.name === "null" || item.name === "" ? defaultEmpty : item.name}
                  </span>
                  <span className="text-gray-400">{item.count}</span>
                </div>
                {/* Mini progress bar */}
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-gray-300 transition-all group-hover:bg-gray-500 dark:bg-gray-600 dark:group-hover:bg-gray-400"
                    style={{ width: `${(item.count / totalInList) * 100}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
