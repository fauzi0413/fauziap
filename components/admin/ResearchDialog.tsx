"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createResearchAction, updateResearchAction } from "@/actions/research";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Research } from "@prisma/client";
import { convertGoogleDriveUrl } from "@/utils/media";

type Mode = { type: "create" } | { type: "edit"; data: Research };

interface ResearchDialogProps {
  mode: Mode;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function toDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

const inputClass =
  "mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800";

const textareaClass =
  "mt-2 w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800 min-h-[100px] resize-y";

export function ResearchDialog({ mode, open, onClose, onSuccess }: ResearchDialogProps) {
  const isEdit = mode.type === "edit";
  const item = isEdit ? mode.data : null;

  const [title, setTitle] = useState(item?.title ?? "");
  const [category, setCategory] = useState(item?.category ?? "PUBLICATION");
  const [publisher, setPublisher] = useState(item?.publisher ?? "");
  const [authors, setAuthors] = useState(item?.authors ?? "");
  const [publishDate, setPublishDate] = useState(toDateInput(item?.publishDate));
  const [description, setDescription] = useState(item?.description ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  
  const [imageRaw, setImageRaw] = useState(item?.image ?? "");
  const [imageUrl, setImageUrl] = useState(item?.image ? convertGoogleDriveUrl(item.image) : "");

  const [isPublic, setIsPublic] = useState(item?.isPublic ?? true);

  const [isPending, startTransition] = useTransition();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? "");
      setCategory(item?.category ?? "PUBLICATION");
      setPublisher(item?.publisher ?? "");
      setAuthors(item?.authors ?? "");
      setPublishDate(toDateInput(item?.publishDate ?? new Date()));
      setDescription(item?.description ?? "");
      setUrl(item?.url ?? "");
      setImageRaw(item?.image ?? "");
      setImageUrl(item?.image ? convertGoogleDriveUrl(item.image) : "");
      setIsPublic(item?.isPublic ?? true);
      
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open, mode, isEdit, item]);

  function handleImageChange(val: string) {
    setImageRaw(val);
    setImageUrl(val ? convertGoogleDriveUrl(val) : "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!publishDate) {
      toast.error("Tanggal rilis wajib diisi");
      return;
    }

    const payload = {
      title: title.trim(),
      category: category.trim(),
      publisher: publisher.trim(),
      authors: authors.trim() || null,
      publishDate: new Date(publishDate),
      description: description.trim() || null,
      url: url.trim() || null,
      image: imageUrl || null,
      isPublic,
    };

    startTransition(async () => {
      const res = isEdit
        ? await updateResearchAction(item!.id, payload)
        : await createResearchAction(payload);
      
      if (res.success) {
        toast.success(isEdit ? "Data riset diperbarui!" : "Data riset berhasil ditambahkan!");
        onSuccess();
        onClose();
      } else {
        toast.error("error" in res ? res.error : "Gagal menyimpan data.");
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative flex h-full max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-2xl dark:bg-gray-950">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEdit ? "Edit Riset/Dataset" : "Tambah Riset/Dataset Baru"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Isi kelengkapan data penelitian atau dataset Anda.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form id="research-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Judul Riset / Paper / Dataset <span className="text-red-500">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Customer Satisfaction Analysis Dataset"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Kategori
                </label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className={inputClass}
                >
                  <option value="PUBLICATION">Jurnal / Makalah Ilmiah (Publication)</option>
                  <option value="DATASET">Dataset / Kumpulan Data (Dataset)</option>
                  <option value="ARTICLE">Artikel / Posting Blog (Article)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Tanggal Rilis <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Penerbit / Respositori <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="Misal: IEEE, Kaggle, Medium"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Penulis (Authors)
                </label>
                <input
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  placeholder="Fauzi Aditya Pratama, Jane Doe"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Tautan Utama (URL)
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://doi.org/10.xxxx atau tautan referensi lain"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Deskripsi / Abstrak
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan latar belakang singkat penelitian atau penjelasan data yang dikumpulkan..."
                className={textareaClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Thumbnail Gambar
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="text"
                    value={imageRaw}
                    onChange={(e) => handleImageChange(e.target.value)}
                    placeholder="https://… atau share link Google Drive"
                    className={`${inputClass} mt-0 flex-1`}
                  />
                  {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt="preview"
                      className="h-10 w-14 shrink-0 rounded border border-gray-200 object-cover dark:border-gray-700"
                      onError={(e) => (e.currentTarget.style.opacity = "0.3")}
                    />
                  )}
                </div>
                <div className="mt-2">
                  <ImageUpload value={imageRaw} onChange={handleImageChange} label="Unggah Gambar" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Status
                </label>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`mt-2 flex h-10 w-full items-center justify-between rounded-md px-4 text-sm font-medium transition ${
                    isPublic
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {isPublic ? "Ditampilkan ke Publik" : "Disembunyikan (Draft)"}
                  <div
                    className={`h-4 w-8 rounded-full p-0.5 transition-colors ${
                      isPublic ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full bg-white transition-transform ${
                        isPublic ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50 rounded-b-xl">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="research-form" disabled={isPending} className="min-w-[120px]">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEdit ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Data"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
