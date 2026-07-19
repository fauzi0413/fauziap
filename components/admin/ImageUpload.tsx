"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
  onDeleted?: () => void;
}

export function ImageUpload({ value, onChange, label = "Pilih Gambar & Unggah", disabled = false, onDeleted }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!inputFileRef.current?.files) {
      return;
    }
    const file = inputFileRef.current.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const newBlob = await response.json();
      onChange(newBlob.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal mengunggah gambar. Cek konsol atau pastikan konfigurasi Vercel Blob token benar.");
    } finally {
      setIsUploading(false);
      // Reset input value to allow uploading the same file again if needed
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!value.includes('vercel-storage.com')) {
      onChange("");
      if (onDeleted) onDeleted();
      return;
    }

    if (!confirm("Yakin ingin menghapus gambar ini dari server?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      onChange("");
      if (onDeleted) onDeleted();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Gagal menghapus gambar dari server. Silakan hapus manual tautan jika diperlukan.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isDisabled = isUploading || isDeleting || disabled;

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isDisabled}
        className="hidden"
        id={`image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />
      
      <div className="flex items-center gap-3">
        <label
          htmlFor={`image-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className={`inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 ${
            isDisabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              Mengunggah...
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4 text-gray-400" />
              {label}
            </>
          )}
        </label>
        
        {value && !isUploading && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle className="h-3.5 w-3.5" /> File berhasil diunggah
            </span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
