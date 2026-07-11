"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCertificateAction, updateCertificateAction } from "@/actions/certificate";
import { convertGoogleDriveUrl } from "@/utils/media";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Certificate } from "@prisma/client";

type Mode = { type: "create" } | { type: "edit"; certificate: Certificate };

interface CertificateDialogProps {
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

export function CertificateDialog({ mode, open, onClose, onSuccess }: CertificateDialogProps) {
  const isEdit = mode.type === "edit";
  const cert = isEdit ? mode.certificate : null;

  const [name, setName] = useState(cert?.name ?? "");
  const [issuer, setIssuer] = useState(cert?.issuer ?? "");
  
  const [issueDate, setIssueDate] = useState(toDateInput(cert?.issueDate));
  const [expiryDate, setExpiryDate] = useState(toDateInput(cert?.expiryDate));
  const [doesNotExpire, setDoesNotExpire] = useState(!cert?.expiryDate && isEdit);

  const [credentialId, setCredentialId] = useState(cert?.credentialId ?? "");
  const [credentialUrl, setCredentialUrl] = useState(cert?.credentialUrl ?? "");
  
  const [imageRaw, setImageRaw] = useState(cert?.image ?? "");
  const [imageUrl, setImageUrl] = useState(cert?.image ? convertGoogleDriveUrl(cert.image) : "");
  const [isPublic, setIsPublic] = useState(cert?.isPublic ?? true);

  const [isPending, startTransition] = useTransition();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(cert?.name ?? "");
      setIssuer(cert?.issuer ?? "");
      setIssueDate(toDateInput(cert?.issueDate));
      setExpiryDate(toDateInput(cert?.expiryDate));
      setDoesNotExpire(!cert?.expiryDate && isEdit);
      setCredentialId(cert?.credentialId ?? "");
      setCredentialUrl(cert?.credentialUrl ?? "");
      setImageRaw(cert?.image ?? "");
      setImageUrl(cert?.image ? convertGoogleDriveUrl(cert.image) : "");
      setIsPublic(cert?.isPublic ?? true);
      
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open, mode, isEdit]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleImageChange(val: string) {
    setImageRaw(val);
    setImageUrl(val ? convertGoogleDriveUrl(val) : "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate,
      expiryDate: doesNotExpire ? null : (expiryDate || null),
      credentialId: credentialId.trim() || null,
      credentialUrl: credentialUrl.trim() || null,
      image: imageUrl || null,
      isPublic,
    };

    startTransition(async () => {
      const res = isEdit
        ? await updateCertificateAction(cert!.id, payload)
        : await createCertificateAction(payload);

      if (res.success) {
        toast.success(isEdit ? "Sertifikat berhasil diperbarui." : "Sertifikat berhasil ditambahkan.");
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
              {isEdit ? "Edit Sertifikat" : "Tambah Sertifikat"}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Kelola kredensial, masa berlaku, dan tautan verifikasi.
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
          <form id="cert-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Nama Sertifikat / Kursus <span className="text-red-500">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Penerbit / Organisasi (Issuer) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  className={inputClass}
                />
              </div>
            </div>

            {/* 2. Timeline */}
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Tanggal Terbit <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Kedaluwarsa
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={issueDate}
                    disabled={doesNotExpire}
                    className={`${inputClass} disabled:opacity-50`}
                  />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={doesNotExpire}
                      onChange={(e) => setDoesNotExpire(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:focus:ring-white"
                    />
                    Berlaku seumur hidup
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Credentials and Link */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="e.g. AWS-12345"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Credential URL
                </label>
                <input
                  type="text"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://verif.yoursite.com"
                  className={inputClass}
                />
              </div>
            </div>

            {/* 4. Media & Visibility */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Gambar / Scan Sertifikat (Url / G-Drive)
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
                  Visibilitas
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

          </form>
        </div>

        {/* Sticky footer actions */}
        <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="cert-form" disabled={isPending || !name.trim() || !issuer.trim() || !issueDate}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan…
              </>
            ) : isEdit ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Sertifikat"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
