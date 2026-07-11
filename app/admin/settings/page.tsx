import { siteSettingService } from "@/services/site-setting";
import { SiteSettingForm } from "@/components/admin/SiteSettingForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await siteSettingService.getSetting();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Site Setting"
        description="Kelola SEO global, favicon, logo, analytics, Open Graph, maintenance mode, footer, dan copyright."
      />
      <SiteSettingForm initialData={settings} />
    </div>
  );
}
