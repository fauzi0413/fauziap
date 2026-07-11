"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createExperienceAction, updateExperienceAction } from "@/actions/experience";
import { convertGoogleDriveUrl } from "@/utils/media";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import type { Technology } from "@prisma/client";
import type { ExperienceWithRelations } from "@/components/admin/ExperienceTable";

type Mode = { type: "create" } | { type: "edit"; experience: ExperienceWithRelations };

interface ExperienceDialogProps {
  mode: Mode;
  open: boolean;
  technologies: Technology[];
  onClose: () => void;
  onSuccess: () => void;
}

/** Format Date → "YYYY-MM-DD" untuk input[type=date] */
function toDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

const inputClass =
  "mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800";
const textareaClass =
  "mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800";

function TechSelect({ technologies, selected, onChange }: {
  technologies: Technology[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => {
        const active = selected.includes(tech.id);
        return (
          <button
            key={tech.id}
            type="button"
            onClick={() => toggle(tech.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition ${
              active
                ? "border-gray-950 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            {tech.icon?.startsWith("http") && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tech.icon} alt="" className="h-4 w-4 object-contain" />
            )}
            {tech.name}
          </button>
        );
      })}
      {technologies.length === 0 && (
        <p className="text-sm text-gray-400">Belum ada master data teknologi.</p>
      )}
    </div>
  );
}

export function ExperienceDialog({ mode, open, technologies, onClose, onSuccess }: ExperienceDialogProps) {
  const isEdit = mode.type === "edit";
  const exp = isEdit ? mode.experience : null;

  const [title, setTitle] = useState(exp?.title ?? "");
  const [company, setCompany] = useState(exp?.company ?? "");
  const [companyLogoRaw, setCompanyLogoRaw] = useState(exp?.companyLogo ?? "");
  const [companyLogoUrl, setCompanyLogoUrl] = useState(exp?.companyLogo ? convertGoogleDriveUrl(exp.companyLogo) : "");
  const [location, setLocation] = useState(exp?.location ?? "");
  const [type, setType] = useState(exp?.type ?? "");
  
  const [startDate, setStartDate] = useState(toDateInput(exp?.startDate));
  const [endDate, setEndDate] = useState(toDateInput(exp?.endDate));
  const [isCurrent, setIsCurrent] = useState(exp?.isCurrent ?? false);
  
  const [description, setDescription] = useState(exp?.description ?? "");
  const [responsibilities, setResponsibilities] = useState(exp?.responsibilities ?? "");
  
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(
    exp?.technologies.map((t) => t.technologyId) ?? []
  );

  const [isPending, startTransition] = useTransition();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle(exp?.title ?? "");
      setCompany(exp?.company ?? "");
      setCompanyLogoRaw(exp?.companyLogo ?? "");
      setCompanyLogoUrl(exp?.companyLogo ? convertGoogleDriveUrl(exp.companyLogo) : "");
      setLocation(exp?.location ?? "");
      setType(exp?.type ?? "");
      setStartDate(toDateInput(exp?.startDate));
      setEndDate(toDateInput(exp?.endDate));
      setIsCurrent(exp?.isCurrent ?? false);
      setDescription(exp?.description ?? "");
      setResponsibilities(exp?.responsibilities ?? "");
      setSelectedTechIds(exp?.technologies.map((t) => t.technologyId) ?? []);
      
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleLogoChange(val: string) {
    setCompanyLogoRaw(val);
    setCompanyLogoUrl(val ? convertGoogleDriveUrl(val) : "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      company: company.trim(),
      companyLogo: companyLogoUrl || null,
      location: location.trim() || null,
      type: type.trim() || null,
      startDate,
      endDate: isCurrent ? null : (endDate || null),
      isCurrent,
      description: description.trim() || null,
      responsibilities: responsibilities.trim() || null,
      technologyIds: selectedTechIds,
    };

    startTransition(async () => {
      const res = isEdit
        ? await updateExperienceAction(exp!.id, payload)
        : await createExperienceAction(payload);

      if (res.success) {
        toast.success(isEdit ? "Pengalaman berhasil diperbarui." : "Pengalaman berhasil ditambahkan.");
        onSuccess();
        onClose();
      } else {
        toast.error("error" in res ? res.error : "Terjadi kesalahan.");
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-950 dark:text-white">
              {isEdit ? "Edit Pengalaman Kerja" : "Tambah Pengalaman Kerja"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Riwayat karir, posisi, perusahaan, dan teknologi yang digunakan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scroll container */}
        <div className="mt-5 max-h-[75vh] overflow-y-auto pr-2">
          <form id="exp-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Posisi / Jabatan <span className="text-red-500">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. PT Telkom Indonesia"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Logo Perusahaan (URL / G-Drive)
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="text"
                    value={companyLogoRaw}
                    onChange={(e) => handleLogoChange(e.target.value)}
                    placeholder="https://… atau share link Google Drive"
                    className={`${inputClass} mt-0 flex-1`}
                  />
                  {companyLogoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={companyLogoUrl}
                      alt="preview"
                      className="h-10 w-10 shrink-0 rounded object-contain ring-1 ring-gray-200 dark:ring-gray-700"
                      onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <ImageUpload value={companyLogoRaw} onChange={handleLogoChange} label="Unggah Logo Perusahaan" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Jakarta, Indonesia (Remote)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Tipe Pekerjaan
                </label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="e.g. Full-time, Freelance, Contract"
                  className={inputClass}
                />
              </div>
            </div>

            {/* 2. Timeline */}
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Selesai
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    disabled={isCurrent}
                    className={`${inputClass} disabled:opacity-50`}
                  />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={isCurrent}
                      onChange={(e) => setIsCurrent(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:focus:ring-white"
                    />
                    Sampai Sekarang
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Ringkasan / Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Ringkasan singkat tentang peran di perusahaan ini…"
                  className={textareaClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Tanggung Jawab / Responsibilities
                </label>
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  rows={4}
                  placeholder="Daftar tanggung jawab utama (gunakan markdown list atau teks paragraf)…"
                  className={textareaClass}
                />
              </div>
            </div>

            {/* 4. Technologies */}
            <div>
               <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Teknologi yang Digunakan
              </label>
              <TechSelect
                technologies={technologies}
                selected={selectedTechIds}
                onChange={setSelectedTechIds}
              />
            </div>

          </form>
        </div>

        {/* Sticky footer actions */}
        <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="exp-form" disabled={isPending || !title.trim() || !company.trim() || !startDate}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan…
              </>
            ) : isEdit ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Pengalaman"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
