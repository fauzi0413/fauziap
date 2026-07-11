import { skillService } from "@/services/skill";
import { technologyService } from "@/services/technology";
import SkillTable from "@/components/admin/SkillTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const [skills, technologies] = await Promise.all([
    skillService.getAll(),
    technologyService.getAll(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Skill"
        description="Hubungkan Technology dengan level penguasaan, kategori, urutan, dan status tampil publik."
      />
      <SkillTable initialData={skills} technologies={technologies} />
    </div>
  );
}
