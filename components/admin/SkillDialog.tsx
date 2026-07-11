"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSkillAction, updateSkillAction } from "@/actions/skill";
import { toast } from "sonner";
import type { Technology } from "@prisma/client";
import type { SkillWithTechnology } from "@/components/admin/SkillTable";

const LEVEL_OPTIONS = ["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"];
const CATEGORY_SUGGESTIONS = ["Frontend", "Backend", "Mobile", "DevOps", "Database", "Design", "Testing", "Other"];

type Mode = { type: "create" } | { type: "edit"; skill: SkillWithTechnology };

interface SkillDialogProps {
  mode: Mode;
  open: boolean;
  technologies: Technology[];
  onClose: () => void;
  onSuccess: () => void;
}

export function SkillDialog({ mode, open, technologies, onClose, onSuccess }: SkillDialogProps) {
  const isEdit = mode.type === "edit";
  const skill = isEdit ? mode.skill : null;

  const [technologyId, setTechnologyId] = useState(skill?.technologyId ?? "");
  const [level, setLevel] = useState(skill?.level ?? "");
  const [category, setCategory] = useState(skill?.category ?? "");
  const [isPublic, setIsPublic] = useState(skill?.isPublic ?? true);
  const [displayOrder, setDisplayOrder] = useState(String(skill?.displayOrder ?? 0));
  const [isPending, startTransition] = useTransition();
  const firstInputRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (open) {
      setTechnologyId(skill?.technologyId ?? "");
      setLevel(skill?.level ?? "");
      setCategory(skill?.category ?? "");
      setIsPublic(skill?.isPublic ?? true);
      setDisplayOrder(String(skill?.displayOrder ?? 0));
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      technologyId,
      level: level || null,
      category: category || null,
      isPublic,
      displayOrder: parseInt(displayOrder) || 0,
    };

    startTransition(async () => {
      const res = isEdit
        ? await updateSkillAction(skill!.id, payload)
        : await createSkillAction(payload);

      if (res.success) {
        toast.success(isEdit ? "Skill berhasil diperbarui." : "Skill berhasil ditambahkan.");
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-950 dark:text-white">
              {isEdit ? "Edit Skill" : "Tambah Skill"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Pilih teknologi yang dikuasai dan tentukan level keahliannya.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Technology */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              Teknologi <span className="text-red-500">*</span>
            </label>
            <select
              ref={firstInputRef}
              required
              value={technologyId}
              onChange={(e) => setTechnologyId(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-gray-600 dark:focus:bg-gray-800"
            >
              <option value="" disabled>Pilih teknologi…</option>
              {technologies.map((tech) => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              Level Keahlian
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-gray-600 dark:focus:bg-gray-800"
            >
              <option value="">— Tidak ditentukan —</option>
              {LEVEL_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">Beginner → Elementary → Intermediate → Advanced → Expert</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              Kategori
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Frontend, Backend, DevOps…"
              list="category-suggestions"
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-600 dark:focus:bg-gray-800"
            />
            <datalist id="category-suggestions">
              {CATEGORY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
            </datalist>
            <p className="mt-1 text-xs text-gray-400">Untuk pengelompokan di halaman Skills publik.</p>
          </div>

          {/* Display Order + Is Public */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Urutan Tampil
              </label>
              <input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-gray-600 dark:focus:bg-gray-800"
              />
              <p className="mt-1 text-xs text-gray-400">Angka kecil = tampil duluan.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Tampilkan Publik
              </label>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-md border text-sm font-medium transition ${
                  isPublic
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                    : "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isPublic ? "bg-green-500" : "bg-gray-400"}`} />
                {isPublic ? "Publik" : "Tersembunyi"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending || !technologyId}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan…
                </>
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Skill"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
