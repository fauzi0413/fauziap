import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminSkillsPage() {
  return (
    <ModulePlaceholder
      title="Skill"
      description="Hubungkan Technology dengan level penguasaan, kategori, urutan, dan status tampil publik."
      fields={["Technology", "Level", "Category", "Display Order", "Is Public", "Created At"]}
    />
  );
}
