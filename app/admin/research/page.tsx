import { researchService } from "@/services/research";
import ResearchTable from "@/components/admin/ResearchTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  const dataset = await researchService.getAll();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Riset & Publikasi"
        description="Kelola daftar paper penelitian, jurnal akademik, ataupun tautan dataset Anda."
      />
      <ResearchTable initialData={dataset} />
    </div>
  );
}
