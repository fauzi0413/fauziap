import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { portfolioService } from "@/services/portfolio";
import { ContactForm } from "@/components/public/ContactForm";
import { PageHeader } from "@/components/public/PageHeader";
import { PublicShell } from "@/components/public/PublicShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Form kontak profesional untuk menyimpan pesan ke database.",
};

export default async function ContactPage() {
  const profile = await portfolioService.getProfile();

  return (
    <PublicShell profile={profile}>
      <main>
        <PageHeader eyebrow="Contact" title="Mari diskusikan project berikutnya." description="Pesan dari form ini akan tersimpan ke tabel ContactMessage." />
        <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            <ContactItem icon={<Mail className="h-5 w-5" />} label="Email" value={profile?.user.email ?? "Belum tersedia"} />
            <ContactItem icon={<MapPin className="h-5 w-5" />} label="Lokasi" value={profile?.location ?? "Belum tersedia"} />
            <ContactItem icon={<FaGithub className="h-5 w-5" />} label="GitHub" value={profile?.githubUrl ?? "Belum tersedia"} />
            <ContactItem icon={<FaLinkedin className="h-5 w-5" />} label="LinkedIn" value={profile?.linkedinUrl ?? "Belum tersedia"} />
          </div>
          <ContactForm />
        </section>
      </main>
    </PublicShell>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="rounded-md bg-black/[0.06] p-3">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/35">{label}</p>
        <p className="mt-1 break-all font-semibold">{value}</p>
      </div>
    </div>
  );
}
