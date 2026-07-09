import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminMediaPage() {
  return (
    <ModulePlaceholder
      title="Media Library"
      description="Kelola gambar, logo, thumbnail, dokumen, dan aset yang dapat digunakan ulang."
      fields={["File", "Type", "URL", "Alt Text", "Size", "Module Usage", "Uploaded At"]}
    />
  );
}
