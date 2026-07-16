"use client";

import { useState, useTransition } from "react";
import { Loader2, ArrowUp, ArrowDown, LayoutList, Eye, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveResumeSettingsAction } from "@/actions/resume-setting";
import { toast } from "sonner";
import Link from "next/link";
import type { ResumeSetting } from "@prisma/client";

interface Props {
  initialData: ResumeSetting;
}

const SECTION_LABELS: Record<string, string> = {
  experience: "Pengalaman Kerja",
  education: "Pendidikan Dasar & Lanjutan",
  skills: "Keahlian & Teknologi (Skills)",
  projects: "Studi Kasus & Proyek (Portfolio)",
  certificates: "Sertifikasi & Kredensial",
};

export function ResumeSettingForm({ initialData }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [showExperience, setShowExperience] = useState(initialData.showExperience);
  const [showEducation, setShowEducation] = useState(initialData.showEducation);
  const [showProjects, setShowProjects] = useState(initialData.showProjects);
  const [showCertificates, setShowCertificates] = useState(initialData.showCertificates);
  const [showSkills, setShowSkills] = useState(initialData.showSkills);
  const [isAtsOptimized, setIsAtsOptimized] = useState(initialData.isAtsOptimized);

  const savedSectionOrder = (() => {
    try {
      const raw = initialData.sectionOrder ? JSON.parse(initialData.sectionOrder) : [];
      if (Array.isArray(raw)) return raw.length > 0 ? raw : ["experience", "education", "skills", "projects", "certificates"];
      return raw.order || ["experience", "education", "skills", "projects", "certificates"];
    } catch {
      return ["experience", "education", "skills", "projects", "certificates"];
    }
  })();

  const [sectionOrder, setSectionOrder] = useState<string[]>(savedSectionOrder);

  const savedDataLimitMode = (() => {
    try {
      const raw = initialData.sectionOrder ? JSON.parse(initialData.sectionOrder) : [];
      if (!Array.isArray(raw) && raw.mode) return raw.mode;
      return "ALL";
    } catch {
      return "ALL";
    }
  })();

  const [dataLimitMode, setDataLimitMode] = useState<string>(savedDataLimitMode);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const items = [...sectionOrder];
    [items[index - 1], items[index]] = [items[index], items[index - 1]];
    setSectionOrder(items);
  };

  const moveDown = (index: number) => {
    if (index === sectionOrder.length - 1) return;
    const items = [...sectionOrder];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    setSectionOrder(items);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        showExperience,
        showEducation,
        showProjects,
        showCertificates,
        showSkills,
        isAtsOptimized,
        sectionOrder,
        dataLimitMode,
      };

      const res = await saveResumeSettingsAction(payload);
      if (res.success) {
        toast.success("Pengaturan template ATS Resume berhasil disimpan!");
      } else {
        toast.error(res.error || "Gagal menyimpan konfigurasi.");
      }
    });
  }

  const hasChanges = 
    showExperience !== initialData.showExperience ||
    showEducation !== initialData.showEducation ||
    showProjects !== initialData.showProjects ||
    showCertificates !== initialData.showCertificates ||
    showSkills !== initialData.showSkills ||
    isAtsOptimized !== initialData.isAtsOptimized ||
    JSON.stringify(sectionOrder) !== JSON.stringify(savedSectionOrder) ||
    dataLimitMode !== savedDataLimitMode;

  return (
    <>
      {hasChanges && (
        <div className="fixed top-24 right-8 z-50 animate-bounce rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-lg dark:border-yellow-900/50 dark:bg-yellow-900/20">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-500">Ada Perubahan Data</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-600">Jangan lupa klik "Update Format CV".</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 pb-12">
        {/* ── ATS Mode Panel ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="border-b border-gray-100 p-5 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Standar ATS (Applicant Tracking System)</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Pastikan mode ini aktif jika ditujukan untuk sistem portal rekrutmen. Layout akan diubah ke mode hitam putih, tanpa dual-kolom, menggunakan bullet point absolut dan ukuran font sistem mesin parser standar.
          </p>
        </div>
        <div className="p-5">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
            <div className="flex h-5 items-center">
              <input
                type="checkbox"
                checked={isAtsOptimized}
                onChange={(e) => setIsAtsOptimized(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:focus:ring-white"
              />
            </div>
            <div className="flex-1">
              <h4 className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-white">
                Aktifkan Format Mutlak ATS
                {isAtsOptimized && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </h4>
              <p className="text-sm text-gray-500">
                Mematikan semua warna kustom, menonaktifkan desain grafis pada profil, dan mengunci ke font standar sistem (Calibri / Arial).
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        {/* ── Visibility Toggles ── */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Modul yang Dicetak ke PDF</h3>
            <p className="mt-1 text-xs text-gray-500">Pilih komponen apa saja yang akan dirangkum.</p>
          </div>
          <div className="flex flex-col gap-0.5 p-3">
            {[
              { id: "exp", label: SECTION_LABELS["experience"], val: showExperience, setter: setShowExperience },
              { id: "edu", label: SECTION_LABELS["education"], val: showEducation, setter: setShowEducation },
              { id: "skills", label: SECTION_LABELS["skills"], val: showSkills, setter: setShowSkills },
              { id: "projects", label: SECTION_LABELS["projects"], val: showProjects, setter: setShowProjects },
              { id: "certs", label: SECTION_LABELS["certificates"], val: showCertificates, setter: setShowCertificates },
            ].map((mod) => (
              <label
                key={mod.id}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{mod.label}</span>
                <input
                  type="checkbox"
                  checked={mod.val}
                  onChange={(e) => mod.setter(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 focus:outline-none dark:focus:ring-white"
                />
              </label>
            ))}
          </div>
        </div>

        {/* ── Section Ordering ── */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <LayoutList className="h-4 w-4 text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Urutan Prioritas ATS</h3>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Mesin penyaring biasanya lebih mudah meloloskan jika Pengalaman diletakkan lebih atas.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-4">
            {sectionOrder.map((sectionKey, index) => (
              <div
                key={sectionKey}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 pr-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {index + 1}
                  </span>
                  {SECTION_LABELS[sectionKey] || sectionKey}
                </span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 transition hover:text-gray-900 disabled:opacity-30 dark:hover:text-white"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === sectionOrder.length - 1}
                    className="p-1 text-gray-400 transition hover:text-gray-900 disabled:opacity-30 dark:hover:text-white"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── Data Limit Setting ── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="border-b border-gray-100 p-5 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <LayoutList className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Batas Data CV (Data Limit Mode)</h3>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Tentukan apakah ingin menampilkan seluruh data Anda, hanya data yang ditandai *Featured/Highlight*, atau sekadar data-data terbaru (maksimal 3) agar CV tidak terlalu panjang.
          </p>
        </div>
        <div className="flex flex-col gap-3 p-5 sm:flex-row">
          <label className={`flex flex-1 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${dataLimitMode === 'ALL' ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900'}`}>
            <input
              type="radio"
              name="dataLimitMode"
              value="ALL"
              checked={dataLimitMode === "ALL"}
              onChange={(e) => setDataLimitMode(e.target.value)}
              className="mt-0.5 h-4 w-4 text-gray-900 focus:ring-gray-900 dark:bg-gray-800 dark:focus:ring-white"
            />
            <div className="w-full flex-1">
              <div className="flex items-center justify-between">
                <span className="block text-sm font-medium text-gray-900 dark:text-white">Tampilkan Semua Data</span>
                {savedDataLimitMode === "ALL" && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Aktif</span>
                )}
              </div>
              <span className="block text-xs text-gray-500 mt-1">CV akan mencakup semua histori karir, project, dan sertifikat yang Anda miliki (Bisa sangat panjang).</span>
            </div>
          </label>
          <label className={`flex flex-1 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${dataLimitMode === 'FEATURED' ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900'}`}>
            <input
              type="radio"
              name="dataLimitMode"
              value="FEATURED"
              checked={dataLimitMode === "FEATURED"}
              onChange={(e) => setDataLimitMode(e.target.value)}
              className="mt-0.5 h-4 w-4 text-gray-900 focus:ring-gray-900 dark:bg-gray-800 dark:focus:ring-white"
            />
            <div className="w-full flex-1">
              <div className="flex items-center justify-between">
                <span className="block text-sm font-medium text-gray-900 dark:text-white">Hanya Data Highlight</span>
                {savedDataLimitMode === "FEATURED" && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Aktif</span>
                )}
              </div>
              <span className="block text-xs text-gray-500 mt-1">Hanya menampilkan Portfolio dan Pengalaman yang ditandai sebagai *Featured*.</span>
            </div>
          </label>
          <label className={`flex flex-1 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${dataLimitMode === 'LATEST' ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900'}`}>
            <input
              type="radio"
              name="dataLimitMode"
              value="LATEST"
              checked={dataLimitMode === "LATEST"}
              onChange={(e) => setDataLimitMode(e.target.value)}
              className="mt-0.5 h-4 w-4 text-gray-900 focus:ring-gray-900 dark:bg-gray-800 dark:focus:ring-white"
            />
            <div className="w-full flex-1">
              <div className="flex items-center justify-between">
                <span className="block text-sm font-medium text-gray-900 dark:text-white">Data Terbaru Saja</span>
                {savedDataLimitMode === "LATEST" && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Aktif</span>
                )}
              </div>
              <span className="block text-xs text-gray-500 mt-1">Otomatis menyaring 3 Pengalaman terbaru, 3 Project terbaru, dll. Cocok untuk CV 1-2 halaman.</span>
            </div>
          </label>
        </div>
      </div>

      {/* ── Submit & Actions ── */}
      <div className="flex shrink-0 items-center justify-between pt-6">
        <Button type="button" variant="outline" className="gap-2" onClick={() => setShowPreviewModal(true)}>
          <Eye className="h-4 w-4" />
          Live Preview PDF
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan Konfigurasi…
            </>
          ) : (
            "Update Format CV"
          )}
        </Button>
      </div>

      {/* ── Preview Modal ── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPreviewModal(false)} />

          {/* Modal Container */}
          <div className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-950">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Live Preview PDF</h3>
                <p className="text-xs text-gray-500">Melihat hasil nyata dari CV ATS Anda</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPreviewModal(false)}>
                Tutup
              </Button>
            </div>

            {/* Iframe Content */}
            <div className="flex-1 bg-gray-100 p-2 dark:bg-gray-900 sm:p-4">
              <iframe
                src="/preview-resume"
                className="h-full w-full rounded border border-gray-200 bg-white shadow-sm dark:border-gray-800"
                title="CV Preview"
              />
            </div>
          </div>
        </div>
      )}
      </form>
    </>
  );
}
