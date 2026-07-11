import {
  BarChart3,
  Briefcase,
  Cpu,
  FileBadge,
  FolderDot,
  GraduationCap,
  MousePointerClick,
  Shapes,
} from "lucide-react";
import { adminService } from "@/services/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, activity] = await Promise.all([
    adminService.getDashboardStats(),
    adminService.getRecentActivity(),
  ]);

  const statCards = [
    { title: "Project", value: stats.projects, icon: FolderDot, description: "Total case study dan portfolio item" },
    { title: "Technology", value: stats.technologies, icon: Cpu, description: "Master data stack teknologi" },
    { title: "Skill", value: stats.skills, icon: Shapes, description: "Skill yang terhubung ke technology" },
    { title: "Experience", value: stats.experiences, icon: Briefcase, description: "Pengalaman kerja di timeline publik" },
    { title: "Education", value: stats.educations, icon: GraduationCap, description: "Riwayat pendidikan dan akademik" },
    { title: "Certificate", value: stats.certificates, icon: FileBadge, description: "Kredensial yang ditampilkan publik" },
    { title: "Visitors", value: stats.visitors, icon: MousePointerClick, description: "Kunjungan yang tercatat" },
  ];

  const maxValue = Math.max(...statCards.map((item) => item.value), 1);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Pusat kontrol Personal Portfolio CMS. Semua angka diambil dari database melalui service layer."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Content Growth</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Grafik sederhana berdasarkan jumlah data tiap modul.
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-6 space-y-4">
            {statCards.slice(0, 8).map((item) => (
              <div key={item.title} className="grid grid-cols-[120px_1fr_40px] items-center gap-3">
                <p className="truncate text-sm font-medium text-gray-600 dark:text-gray-300">{item.title}</p>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-gray-950 dark:bg-white"
                    style={{ width: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 0)}%` }}
                  />
                </div>
                <p className="text-right text-sm font-semibold text-gray-950 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Recent Activity</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Perubahan terbaru dari project, blog, dan pesan.
          </p>
          <div className="mt-5 space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="rounded-md border border-gray-100 p-3 dark:border-gray-800">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-gray-950 dark:text-white">{item.label}</p>
                  <span className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {item.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {item.date.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
            {activity.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-gray-800">
                Belum ada aktivitas.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
