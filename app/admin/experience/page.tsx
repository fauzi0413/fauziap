import { experienceService } from "@/services/experience";
import { technologyService } from "@/services/technology";
import ExperienceTable from "@/components/admin/ExperienceTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const [experiences, technologies] = await Promise.all([
    experienceService.getAll(),
    technologyService.getAll(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Experience"
        description="Kelola timeline pengalaman kerja dan teknologi yang digunakan selama bekerja."
      />
      <ExperienceTable initialData={experiences} technologies={technologies} />
    </div>
  );
}
