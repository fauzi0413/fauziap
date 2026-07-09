import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminResumePage() {
  return (
    <ModulePlaceholder
      title="Resume Setting"
      description="Atur tema resume PDF, urutan section, dan visibilitas project/sertifikat tanpa mengubah kode."
      fields={["Theme Color", "Section Order", "Show Projects", "Show Certificates", "Show Skills", "Template", "PDF Settings"]}
    />
  );
}
