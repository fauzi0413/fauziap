import { technologyService } from "@/services/technology";
import TechnologyTable from "@/components/admin/TechnologyTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function TechnologiesPage() {
  const technologies = await technologyService.getAll();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Technology"
        description="Kelola master data teknologi agar Skill dan Project tidak menyimpan data duplikat."
        action={
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Teknologi
        </Button>
        }
      />

      <TechnologyTable initialData={technologies} />
    </div>
  );
}
