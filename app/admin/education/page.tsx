import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminEducationPage() {
  return (
    <ModulePlaceholder
      title="Education"
      description="Kelola riwayat pendidikan, IPK, penelitian, dan pencapaian akademik."
      fields={["Institution", "Logo", "Degree", "Major", "GPA", "Start Date", "End Date", "Description", "Academic Achievement"]}
    />
  );
}
