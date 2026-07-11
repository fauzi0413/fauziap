import { technologyService } from "@/services/technology";
import TechnologyTable from "@/components/admin/TechnologyTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function TechnologiesPage() {
  const technologies = await technologyService.getAll();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Technology"
        description="Kelola master data teknologi agar Skill dan Project tidak menyimpan data duplikat."
      />
      <TechnologyTable initialData={technologies} />
    </div>
  );
}
