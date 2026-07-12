import { notFound } from "next/navigation";
import { projectService } from "@/services/project";
import { technologyService } from "@/services/technology";
import { experienceService } from "@/services/experience";
import { educationService } from "@/services/education";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [project, technologies, experiences, educations] = await Promise.all([
    projectService.getById(id),
    technologyService.getAll(),
    experienceService.getAll(),
    educationService.getAll(),
  ]);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit: ${project.title}`}
        description="Perbarui detail project, gallery, dan teknologi."
      />
      <ProjectForm project={project} technologies={technologies} experiences={experiences} educations={educations} />
    </div>
  );
}
