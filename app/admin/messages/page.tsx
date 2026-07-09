import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export default function AdminMessagesPage() {
  return (
    <ModulePlaceholder
      title="Contact Message"
      description="Kelola pesan dari pengunjung, tandai sudah dibaca, balas, hapus, dan cari berdasarkan nama/email."
      fields={["Name", "Email", "Subject", "Message", "Read Status", "Reply", "Delete", "Created At"]}
    />
  );
}
