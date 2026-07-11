import { portfolioService } from "@/services/portfolio";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProfileForm } from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await portfolioService.getProfile();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Profile"
        description="Kelola identitas utama yang dipakai Hero, About, Contact, dan Resume."
      />
      <ProfileForm profile={profile} />
    </div>
  );
}
