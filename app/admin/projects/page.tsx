import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminProjectsPage() {
  return (
    <ModulePlaceholder
      title="Project"
      description="Kelola case study lengkap, gallery screenshot, teknologi, status publish, dan featured project."
      fields={["Title", "Slug", "Thumbnail", "Short Description", "Full Description", "Background", "Objectives", "Solution", "Architecture", "Challenges", "Lessons Learned", "Repository URL", "Demo URL", "Documentation", "Featured", "Publish Status", "Gallery", "Technologies"]}
    />
  );
}
