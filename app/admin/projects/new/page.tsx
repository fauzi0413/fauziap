import { technologyService } from "@/services/technology";
import { experienceService } from "@/services/experience";
import { educationService } from "@/services/education";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function NewProjectPage() {
  const [technologies, experiences, educations] = await Promise.all([
    technologyService.getAll(),
    experienceService.getAll(),
    educationService.getAll(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tambah Project"
        description="Buat case study baru dengan gallery, teknologi, dan detail lengkap."
      />
      <ProjectForm technologies={technologies} experiences={experiences} educations={educations} />
    </div>
  );
}
