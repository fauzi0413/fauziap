"use client";

import { useState, useTransition } from "react";
import { Loader2, Globe, Search, LayoutTemplate, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveSiteSettingsAction } from "@/actions/site-setting";
import { convertGoogleDriveUrl } from "@/utils/media";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import type { SiteSetting } from "@prisma/client";

interface Props {
  initialData: SiteSetting;
}

export function SiteSettingForm({ initialData }: Props) {
  const [isPending, startTransition] = useTransition();

  // Basic Identity
  const [siteName, setSiteName] = useState(initialData.siteName);
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(initialData.faviconUrl || "");

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialData.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData.seoDescription || "");
  const [openGraphImage, setOpenGraphImage] = useState(initialData.openGraphImage || "");
  const [twitterHandle, setTwitterHandle] = useState(initialData.twitterHandle || "");

  // Advanced & Footer
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(initialData.googleAnalyticsId || "");
  const [maintenanceMode, setMaintenanceMode] = useState(initialData.maintenanceMode);
  const [footerText, setFooterText] = useState(initialData.footerText || "");
  const [copyrightName, setCopyrightName] = useState(initialData.copyrightName || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        siteName,
        logoUrl: logoUrl ? convertGoogleDriveUrl(logoUrl) : null,
        faviconUrl: faviconUrl ? convertGoogleDriveUrl(faviconUrl) : null,
        seoTitle,
        seoDescription,
        openGraphImage: openGraphImage ? convertGoogleDriveUrl(openGraphImage) : null,
        twitterHandle,
        googleAnalyticsId,
        maintenanceMode,
        footerText,
        copyrightName,
      };

      const res = await saveSiteSettingsAction(payload);
      if (res.success) {
        toast.success("Pengaturan situs berhasil disimpan!");
      } else {
        toast.error(res.error || "Gagal menyimpan konfigurasi situs.");
      }
    });
  };

  const inputClass = "mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800";
  const textareaClass = "mt-2 w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      
      {/* ── 1. Basic Identity ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="border-b border-gray-100 p-5 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Identitas Situs</h3>
          </div>
        </div>
        <div className="grid gap-6 p-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Nama Situs (Site Name)</label>
            <input type="text" required value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputClass} placeholder="e.g. Fauzi Portfolio" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Logo URL (Header)</label>
            <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className={inputClass} placeholder="Google Drive Link atau URL Gambar" />
            <div className="mt-2">
              <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Unggah Logo Situs" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Favicon (Ikon Tab)</label>
            <input type="text" value={faviconUrl} onChange={(e) => setFaviconUrl(e.target.value)} className={inputClass} placeholder="Link logo persegi kecil untuk browser" />
            <div className="mt-2">
              <ImageUpload value={faviconUrl} onChange={setFaviconUrl} label="Unggah Favicon" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SEO & Meta ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="border-b border-gray-100 p-5 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">SEO & Social Meta</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Penjelasan singkat ke Web Crawler (bot pencari google) dan gambar pratinjau yang muncul saat link situs ini dikirim.
          </p>
        </div>
        <div className="grid gap-6 p-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">SEO Default Title</label>
            <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} placeholder="Format: Nama Anda | Portofolio Web" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">SEO Meta Description</label>
            <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} className={textareaClass} placeholder="Situs portofolio pribadi yang berisikan perjalanan dan pengalaman profesional saya..." />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Open Graph Image (Social Thumbnail)</label>
            <input type="text" value={openGraphImage} onChange={(e) => setOpenGraphImage(e.target.value)} className={inputClass} placeholder="URL Thumbnail Open Graph (G-Drive / External)" />
            <div className="mt-2">
              <ImageUpload value={openGraphImage} onChange={setOpenGraphImage} label="Unggah Thumbnail" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Twitter Handle</label>
            <input type="text" value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} className={inputClass} placeholder="@username" />
          </div>
        </div>
      </div>

      {/* ── 3. Footer & Integrations ── */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="border-b border-gray-100 p-5 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Footer & Integrasi</h3>
            </div>
          </div>
          <div className="grid gap-6 p-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Google Analytics ID</label>
              <input type="text" value={googleAnalyticsId} onChange={(e) => setGoogleAnalyticsId(e.target.value)} className={inputClass} placeholder="e.g. G-QWERTY1234" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Copyright Name</label>
              <input type="text" value={copyrightName} onChange={(e) => setCopyrightName(e.target.value)} className={inputClass} placeholder="e.g. Fauzi Aditya" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Footer Text</label>
              <textarea value={footerText} onChange={(e) => setFooterText(e.target.value)} rows={2} className={textareaClass} placeholder="Build with Next.js and Prisma, Deployed on Vercel" />
            </div>
          </div>
        </div>

        {/* 4. Maintenance / Emergency */}
        <div className="rounded-xl border border-red-200 bg-red-50/50 shadow-sm dark:border-red-900/50 dark:bg-red-950/20">
          <div className="border-b border-red-100 p-5 dark:border-red-900/50">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-red-900 dark:text-red-400">Danger Zone</h3>
            </div>
          </div>
          <div className="p-5">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-100 bg-white p-4 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:bg-gray-950 dark:hover:bg-red-950/40">
              <div className="flex h-5 items-center">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-600 dark:border-red-800 dark:bg-gray-950 dark:ring-offset-gray-900"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-red-900 dark:text-red-400">Mode Perbaikan (Maintenance)</h4>
                <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
                  Ubah situs ke halaman Maintenance. Seluruh halaman publik tidak dapat diakses dan akan menampilkan pesan "Sedang Dalam Perbaikan". Jangan diaktifkan kecuali ada krisis.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending} className="px-8">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan…
            </>
          ) : (
            "Simpan Pengaturan Situs"
          )}
        </Button>
      </div>
    </form>
  );
}
