import { resumeSettingService } from "@/services/resume-setting";
import { ResumeSettingForm } from "@/components/admin/ResumeSettingForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const settings = await resumeSettingService.getSetting();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Resume & CV Settings"
        description="Atur struktur data, urutan prioritas seksi, dan format output untuk mesin pencari kerja (ATS Optimization)."
      />
      <ResumeSettingForm initialData={settings} />
    </div>
  );
}
