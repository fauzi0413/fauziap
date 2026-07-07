import { technologyService } from "@/services/technology";
import TechnologyTable from "@/components/admin/TechnologyTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TechnologiesPage() {
  const technologies = await technologyService.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Technologies</h1>
          <p className="text-gray-500 dark:text-gray-400">Kelola master data teknologi untuk portofolio.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Teknologi
        </Button>
      </div>

      <TechnologyTable initialData={technologies} />
    </div>
  );
}
