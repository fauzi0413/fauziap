import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminCertificatesPage() {
  return (
    <ModulePlaceholder
      title="Certificate"
      description="Kelola sertifikat, credential URL, tanggal terbit/kadaluarsa, dan status tampil publik."
      fields={["Name", "Issuer", "Issue Date", "Expiry Date", "Credential ID", "Credential URL", "Image", "Is Public"]}
    />
  );
}
