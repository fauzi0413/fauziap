"use client";

import { useState } from "react";
import { Mail, Phone, X, ExternalLink } from "lucide-react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import type { Profile } from "@prisma/client";

export function ContactModal({
  profile,
  children,
}: {
  profile?: Profile | null;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!profile) return <>{children}</>;

  const hasContact = profile.email || profile.phone || profile.linkedinUrl || profile.githubUrl;
  if (!hasContact) return <>{children}</>;

  const cleanPhoneString = (phone: string) => phone.replace(/\D/g, "");

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 transition hover:bg-black/5"
            >
              <X className="h-5 w-5 opacity-60" />
            </button>
            <h2 className="text-xl font-bold tracking-tight">Mari Berkoneksi</h2>
            <p className="mt-2 text-sm text-black/60">
              Silakan pilih salah satu metode di bawah ini untuk terhubung.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-lg border border-black/10 p-4 transition hover:bg-black/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/[0.03]">
                    <Mail className="h-5 w-5 text-black/60" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold">Email</p>
                    <p className="truncate text-sm text-black/50">{profile.email}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-30" />
                </a>
              )}

              {profile.phone && (
                <a
                  href={`https://wa.me/${cleanPhoneString(profile.phone)}?text=${encodeURIComponent("Halo Fauzi, Saya (ketikkan nama anda)")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-lg border border-black/10 p-4 transition hover:bg-black/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10">
                    <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold">WhatsApp</p>
                    <p className="truncate text-sm text-black/50">{profile.phone}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-30" />
                </a>
              )}

              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-lg border border-black/10 p-4 transition hover:bg-black/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A66C2]/10">
                    <FaLinkedin className="h-5 w-5 text-[#0A66C2]" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold">LinkedIn</p>
                    <p className="truncate text-sm text-black/50">{profile.linkedinUrl}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-30" />
                </a>
              )}

              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-lg border border-black/10 p-4 transition hover:bg-black/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5">
                    <FaGithub className="h-5 w-5 text-black" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold">GitHub</p>
                    <p className="truncate text-sm text-black/50">{profile.githubUrl}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-30" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
