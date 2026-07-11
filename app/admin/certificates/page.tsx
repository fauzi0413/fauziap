import { certificateService } from "@/services/certificate";
import CertificateTable from "@/components/admin/CertificateTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await certificateService.getAll();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Certificate"
        description="Kelola sertifikat, credential URL, tanggal terbit/kedaluwarsa, dan status tampil publik."
      />
      <CertificateTable initialData={certificates} />
    </div>
  );
}
