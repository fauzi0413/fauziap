import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminSettingsPage() {
  return (
    <ModulePlaceholder
      title="Site Setting"
      description="Kelola SEO global, favicon, logo, analytics, Open Graph, maintenance mode, footer, dan copyright."
      fields={["Site Name", "Logo", "Favicon", "SEO Title", "SEO Description", "Google Analytics", "Open Graph", "Twitter Card", "Maintenance Mode", "Footer", "Copyright"]}
    />
  );
}
