import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class AnalyticsService {
  /**
   * Mendapatkan total kunjungan per hari selama 30 hari terakhir.
   */
  async getDailyVisitsLast30Days() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Dapatkan raw logs, agregasi di memori untuk flexibilitas antar DB backend
    // Biasanya ini dilakukan di level DB via date_trunc (PG), tapi karena kita 
    // mau aman antar DB driver (termasuk vercel/neon JS), ini lebih safe untk data stat kecil-menengah
    const visitors = await prisma.visitor.findMany({
      where: { visitedAt: { gte: thirtyDaysAgo } },
      select: { visitedAt: true },
    });

    // Initialize array of last 30 days with 0 counts
    const dailyMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap.set(d.toISOString().slice(0, 10), 0);
    }

    visitors.forEach((v) => {
      const dateStr = v.visitedAt.toISOString().slice(0, 10);
      if (dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
      }
    });

    return Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }

  /**
   * Mendapatkan rangkuman KPI Hari ini vs Kemarin
   */
  async getKPIs() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayCount = await prisma.visitor.count({
      where: { visitedAt: { gte: today } },
    });

    const yesterdayCount = await prisma.visitor.count({
      where: {
        visitedAt: { gte: yesterday, lt: today },
      },
    });

    const totalCount = await prisma.visitor.count();

    return {
      todayCount,
      yesterdayCount,
      totalCount,
      trend:
        yesterdayCount === 0
          ? 100
          : Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100),
    };
  }

  /**
   * Top N agregasi untuk properti spesifik (browser, path, referer, dll)
   */
  private async getTopX(field: Prisma.VisitorScalarFieldEnum, limit = 5) {
    const data = await prisma.visitor.groupBy({
      by: [field],
      _count: { [field]: true },
      orderBy: { _count: { [field]: "desc" } },
      take: limit + 1, // take extra in case there are nulls to filter
    });

    return data
      .filter((d) => d[field] !== null && String(d[field]).trim() !== "")
      .slice(0, limit)
      .map((d) => ({
        name: String(d[field]),
        count: d._count[field],
      }));
  }

  async getTopStats() {
    const [topPages, topBrowsers, topReferers, topCountries] = await Promise.all([
      this.getTopX("path"),
      this.getTopX("browser"),
      this.getTopX("referer"),
      this.getTopX("country"),
    ]);

    return { topPages, topBrowsers, topReferers, topCountries };
  }

  /**
   * Mendapatkan log riwayat visitor terbaru (Real-time history feed)
   */
  async getRecentLog(limit = 10) {
    return prisma.visitor.findMany({
      orderBy: { visitedAt: "desc" },
      take: limit,
    });
  }

  /**
   * Fungsi helper publik untuk merekam data visitor
   * Nanti akan dipanggil secara implisit oleh public route / middleware
   */
  async logVisit(data: Prisma.VisitorCreateInput) {
    return prisma.visitor.create({ data });
  }
}

export const analyticsService = new AnalyticsService();
