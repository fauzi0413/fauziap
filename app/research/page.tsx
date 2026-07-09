import type { Metadata } from "next";
import { portfolioService } from "@/services/portfolio";
import { EmptyState } from "@/components/public/EmptyState";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research",
  description: "Penelitian dan publikasi.",
};

export default async function ResearchPage() {
  const profile = await portfolioService.getProfile();

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader eyebrow="Research" title="Penelitian dan publikasi." description="Halaman ini disiapkan untuk skripsi, dataset, metode, evaluasi, repository, dan paper." />
        <section className="mx-auto max-w-7xl px-5 pb-16">
          <EmptyState
            title="Model Research belum tersedia di schema"
            description="Tambahkan model Research di Prisma schema dan repository/service agar data penelitian tampil sepenuhnya dari database."
          />
        </section>
      </main>
    </PublicShell>
  );
}
