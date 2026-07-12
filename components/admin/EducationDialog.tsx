"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createEducationAction, updateEducationAction } from "@/actions/education";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Education } from "@prisma/client";

type Mode = { type: "create" } | { type: "edit"; education: Education };

interface EducationDialogProps {
  mode: Mode;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Format Date → "YYYY-MM-DD" untuk input[type=month] / input[type=date] */
function toDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

const inputClass =
  "mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800";

export function EducationDialog({ mode, open, onClose, onSuccess }: EducationDialogProps) {
  const isEdit = mode.type === "edit";
  const edu = isEdit ? mode.education : null;

  const [institution, setInstitution] = useState(edu?.institution ?? "");
  const [institutionLogo, setInstitutionLogo] = useState(edu?.institutionLogo ?? "");
  const [degree, setDegree] = useState(edu?.degree ?? "");
  const [major, setMajor] = useState(edu?.major ?? "");
  const [startDate, setStartDate] = useState(toDateInput(edu?.startDate));
  const [endDate, setEndDate] = useState(toDateInput(edu?.endDate));
  const [gpa, setGpa] = useState(edu?.gpa ?? "");
  const [predicate, setPredicate] = useState(edu?.predicate ?? "");
  const [description, setDescription] = useState(edu?.description ?? "");
  const [isPending, startTransition] = useTransition();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setInstitution(edu?.institution ?? "");
      setInstitutionLogo(edu?.institutionLogo ?? "");
      setDegree(edu?.degree ?? "");
      setMajor(edu?.major ?? "");
      setStartDate(toDateInput(edu?.startDate));
      setEndDate(toDateInput(edu?.endDate));
      setGpa(edu?.gpa ?? "");
      setPredicate(edu?.predicate ?? "");
      setDescription(edu?.description ?? "");
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      institution: institution.trim(),
      institutionLogo: institutionLogo.trim() || null,
      degree: degree.trim(),
      major: major.trim() || null,
      startDate,
      endDate: endDate || null,
      gpa: gpa.trim() || null,
      predicate: predicate.trim() || null,
      description: description.trim() || null,
    };

    startTransition(async () => {
      const res = isEdit
        ? await updateEducationAction(edu!.id, payload)
        : await createEducationAction(payload);

      if (res.success) {
        toast.success(isEdit ? "Pendidikan berhasil diperbarui." : "Pendidikan berhasil ditambahkan.");
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

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-950 dark:text-white">
              {isEdit ? "Edit Pendidikan" : "Tambah Pendidikan"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Riwayat akademik yang akan ditampilkan di halaman publik.
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
        <div className="mt-5 max-h-[70vh] overflow-y-auto pr-1">
          <form id="edu-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Institution + Logo */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Nama Institusi <span className="text-red-500">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  required
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Universitas Indonesia"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Logo Institusi (URL)
                </label>
                <input
                  type="text"
                  value={institutionLogo}
                  onChange={(e) => setInstitutionLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className={inputClass}
                />
                {/* Logo preview */}
                {institutionLogo && (
                  <div className="mt-2 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={institutionLogo}
                      alt="logo preview"
                      className="h-10 w-10 rounded object-contain ring-1 ring-gray-200 dark:ring-gray-700"
                      onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                    />
                  </div>
                )}
                <div className="mt-2">
                  <ImageUpload value={institutionLogo} onChange={setInstitutionLogo} label="Unggah Logo Institusi" />
                </div>
              </div>
            </div>

            {/* Degree + Major */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Jenjang / Gelar <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. S1 / Bachelor of Science"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Program Studi / Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="e.g. Teknik Informatika"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Start Date + End Date + GPA */}
            <div className="grid gap-4 sm:grid-cols-3">
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
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-400">Kosongkan jika masih aktif.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  IPK / GPA
                </label>
                <input
                  type="text"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="e.g. 3.85"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Predikat / Predicate
                </label>
                <input
                  type="text"
                  value={predicate}
                  onChange={(e) => setPredicate(e.target.value)}
                  placeholder="e.g. Cum Laude, Summa Cum Laude"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Deskripsi / Pencapaian
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Deskripsi singkat, prestasi akademik, penelitian, organisasi…"
                className="mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800"
              />
            </div>
          </form>
        </div>

        {/* Sticky footer actions */}
        <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="edu-form" disabled={isPending || !institution.trim() || !degree.trim() || !startDate}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan…
              </>
            ) : isEdit ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Pendidikan"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
