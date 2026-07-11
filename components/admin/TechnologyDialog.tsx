"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTechnologyAction, updateTechnologyAction } from "@/actions/technology";
import { toast } from "sonner";
import type { Technology } from "@prisma/client";

type Mode = { type: "create" } | { type: "edit"; tech: Technology };

interface TechnologyDialogProps {
  mode: Mode;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TechnologyDialog({ mode, open, onClose, onSuccess }: TechnologyDialogProps) {
  const isEdit = mode.type === "edit";
  const tech = isEdit ? mode.tech : null;

  const [name, setName] = useState(tech?.name ?? "");
  const [slug, setSlug] = useState(tech?.slug ?? "");
  const [icon, setIcon] = useState(tech?.icon ?? "");
  const [slugManual, setSlugManual] = useState(false);
  const [isPending, startTransition] = useTransition();
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Sync state when mode/open changes
  useEffect(() => {
    if (open) {
      setName(tech?.name ?? "");
      setSlug(tech?.slug ?? "");
      setIcon(tech?.icon ?? "");
      setSlugManual(false);
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManual) {
      setSlug(generateSlug(name));
    }
  }, [name, slugManual]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const payload = { name: name.trim(), slug: slug.trim() || undefined, icon: icon.trim() || undefined };

      const res = isEdit
        ? await updateTechnologyAction(tech!.id, payload)
        : await createTechnologyAction(payload);

      if (res.success) {
        toast.success(isEdit ? "Teknologi berhasil diperbarui." : "Teknologi berhasil ditambahkan.");
        onSuccess();
        onClose();
      } else {
        toast.error("error" in res ? res.error : "Terjadi kesalahan.");
      }
    });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit Teknologi" : "Tambah Teknologi"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-950 dark:text-white">
            {isEdit ? "Edit Teknologi" : "Tambah Teknologi"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. TypeScript"
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-600 dark:focus:bg-gray-800"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
              placeholder="auto-generated dari nama"
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 font-mono text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-600 dark:focus:bg-gray-800"
            />
            <p className="mt-1 text-xs text-gray-400">
              Dikosongkan = otomatis dari nama.{" "}
              {slugManual && (
                <button
                  type="button"
                  className="text-blue-500 underline"
                  onClick={() => { setSlugManual(false); setSlug(generateSlug(name)); }}
                >
                  Reset otomatis
                </button>
              )}
            </p>
          </div>

          {/* Icon / Logo URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              Icon / Logo URL
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="https://cdn.icon.com/typescript.svg"
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-600 dark:focus:bg-gray-800"
            />
            <p className="mt-1 text-xs text-gray-400">Boleh URL gambar atau nama kelas ikon.</p>
          </div>

          {/* Icon preview */}
          {icon && icon.startsWith("http") && (
            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icon} alt="icon preview" className="h-8 w-8 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
              <span className="text-sm text-gray-500">Preview icon</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan…
                </>
              ) : isEdit ? (
                "Simpan Perubahan"
              ) : (
                "Tambah"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
