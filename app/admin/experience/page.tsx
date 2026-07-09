import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminExperiencePage() {
  return (
    <ModulePlaceholder
      title="Experience"
      description="Kelola timeline pengalaman kerja dan teknologi yang digunakan selama bekerja."
      fields={["Company", "Company Logo", "Position", "Location", "Employment Type", "Start Date", "End Date", "Current", "Description", "Technologies"]}
    />
  );
}
