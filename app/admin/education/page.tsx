import { educationService } from "@/services/education";
import { researchService } from "@/services/research";
import EducationTable from "@/components/admin/EducationTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const [educations, researches] = await Promise.all([
    educationService.getAll(),
    researchService.getAll(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Education"
        description="Kelola riwayat pendidikan, IPK, penelitian, dan pencapaian akademik."
      />
      <EducationTable initialData={educations} researches={researches} />
    </div>
  );
}
