import { projectService } from "@/services/project";
import ProjectTable from "@/components/admin/ProjectTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await projectService.getAll();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Project"
        description="Kelola case study lengkap, gallery screenshot, teknologi, status publish, dan featured project."
      />
      <ProjectTable initialData={projects} />
    </div>
  );
}
