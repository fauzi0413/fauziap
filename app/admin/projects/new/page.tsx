import { technologyService } from "@/services/technology";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function NewProjectPage() {
  const technologies = await technologyService.getAll();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tambah Project"
        description="Buat case study baru dengan gallery, teknologi, dan detail lengkap."
      />
      <ProjectForm technologies={technologies} />
    </div>
  );
}
