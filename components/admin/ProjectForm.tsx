"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Link2, Loader2, GripVertical, Star, Eye, EyeOff, ImageOff, Save, ArrowLeft, FileText, Blocks, Briefcase, X, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reorder } from "framer-motion";
import { createProjectAction, updateProjectAction } from "@/actions/project";
import { convertGoogleDriveUrl, generateSlug, isGoogleDriveLink, extractDriveFolderId, isGoogleDriveFolderLink } from "@/utils/media";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Technology, Experience, Education } from "@prisma/client";
import type { ProjectWithRelations } from "@/components/admin/ProjectTable";

// ── Types ──────────────────────────────────────────────────────────────────
interface ImageEntry {
  id?: string; // existing DB id
  raw: string; // what user typed (original Drive link or URL)
  url: string; // converted embed URL stored to DB
  altText: string;
  _uid?: string;
}

// ── Shared input classes ───────────────────────────────────────────────────
const inputCls =
  "mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800";
const textareaCls =
  "mt-2 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800";

// ── Field helpers ──────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-gray-100 pb-2 text-sm font-semibold text-gray-700 dark:border-gray-800 dark:text-gray-300">
      {children}
    </h3>
  );
}

// ── Gallery Section ────────────────────────────────────────────────────────
function GallerySection({ images, onChange }: {
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
}) {
  const [newRaw, setNewRaw] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  function addImage() {
    if (!newRaw.trim()) return;
    const url = convertGoogleDriveUrl(newRaw.trim());
    onChange([...images, { raw: newRaw.trim(), url, altText: "", _uid: Math.random().toString(36).substr(2, 9) }]);
    setNewRaw("");
  }

  async function importFromFolder() {
    if (!newRaw.trim()) return;
    const folderId = extractDriveFolderId(newRaw);
    if (!folderId) return;

    setIsImporting(true);
    try {
      const res = await fetch(`/api/admin/drive/folder?folderId=${folderId}`);
      if (!res.ok) {
         toast.error("Gagal menarik data dari folder Google Drive API.");
         return;
      }
      const data = await res.json();
      if (!data.files || data.files.length === 0) {
         toast.error("Folder kosong atau file bukan tipe gambar.");
         return;
      }

      const newImages = data.files.map((file: any) => ({
        raw: file.name, // Display the file name
        url: `https://lh3.googleusercontent.com/d/${file.id}`,
        altText: file.name.replace(/\.[^/.]+$/, ""), // Default alt text to file name w/o extension
        _uid: Math.random().toString(36).substr(2, 9)
      }));

      // Append new images
      onChange([...images, ...newImages]);
      setNewRaw("");
      toast.success(`${newImages.length} gambar berhasil di-import!`);
    } catch (e: any) {
      toast.error("Terjadi kesalahan sistem saat mencoba import.");
    } finally {
      setIsImporting(false);
    }
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function updateAltText(idx: number, altText: string) {
    onChange(images.map((img, i) => (i === idx ? { ...img, altText } : img)));
  }

  const isDrive = isGoogleDriveLink(newRaw);
  const isDriveFolder = isGoogleDriveFolderLink(newRaw);

  return (
    <div className="space-y-3">
      {/* Existing images */}
      <Reorder.Group axis="y" values={images} onReorder={onChange} className="space-y-3">
        {images.map((img, idx) => (
          <Reorder.Item key={img._uid || img.url} value={img} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800 bg-white dark:bg-gray-950 relative">
            <div className="mt-1 cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 shrink-0 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </div>
          {/* Preview */}
          <div className="h-14 w-20 shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.altText || "preview"}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector(".err-icon")) {
                  const icon = document.createElement("div");
                  icon.className = "err-icon flex h-full items-center justify-center text-gray-300";
                  icon.innerHTML = '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                  parent.appendChild(icon);
                }
              }}
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="line-clamp-2 break-all text-xs text-gray-400" title={img.raw}>
              {img.raw}
            </p>
            <input
              type="text"
              value={img.altText}
              onChange={(e) => updateAltText(idx, e.target.value)}
              placeholder="Alt text / caption…"
              className="h-8 w-full rounded border border-gray-200 bg-gray-50 px-2 text-xs text-gray-700 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-gray-500 dark:focus:bg-gray-800"
            />
          </div>
          <button
            type="button"
            onClick={() => removeImage(idx)}
            className="mt-1 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Add new */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newRaw}
            onChange={(e) => setNewRaw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            placeholder="Paste URL atau Google Drive link…"
            className="h-10 w-full rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-gray-500 dark:focus:bg-gray-800"
          />
          {isDrive && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-blue-500">
              <Link2 className="h-3 w-3" /> Drive
            </span>
          )}
        </div>
        {isDriveFolder ? (
          <Button type="button" variant="outline" size="sm" onClick={importFromFolder} disabled={isImporting}>
            {isImporting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
            Import Folder
          </Button>
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={addImage} disabled={!newRaw.trim()}>
            <Plus className="mr-1 h-4 w-4" /> Tambah
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-400">
        Mendukung URL biasa, Drive share link (file satuan), dan link Share Folder Drive (import banyak).
      </p>
    </div>
  );
}

// ── Technology Multi-select ────────────────────────────────────────────────
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
        <p className="text-sm text-gray-400">Belum ada teknologi. Tambahkan di menu Technology terlebih dahulu.</p>
      )}
    </div>
  );
}

// ── Toggle Button ──────────────────────────────────────────────────────────
function ToggleButton({ active, onLabel, offLabel, onIcon, offIcon, onClick }: {
  active: boolean;
  onLabel: string;
  offLabel: string;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
          : "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
      }`}
    >
      {active ? onIcon : offIcon}
      {active ? onLabel : offLabel}
    </button>
  );
}

// ── Main Form ──────────────────────────────────────────────────────────────
export function ProjectForm({
  project,
  technologies,
  experiences,
  educations,
}: {
  project?: ProjectWithRelations | null;
  technologies: Technology[];
  experiences: Experience[];
  educations: Education[];
}) {
  const router = useRouter();
  const isEdit = !!project;
  const [isPending, startTransition] = useTransition();

  // Basic fields
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugManual, setSlugManual] = useState(false);
  const [thumbnailRaw, setThumbnailRaw] = useState(project?.thumbnail ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail ? convertGoogleDriveUrl(project.thumbnail) : "");
  const [thumbnailErr, setThumbnailErr] = useState(false);
  const [shortDescription, setShortDescription] = useState(project?.shortDescription ?? "");
  const [fullDescription, setFullDescription] = useState(project?.fullDescription ?? "");

  // Context relations
  const [experienceId, setExperienceId] = useState(project?.experienceId ?? "");
  const [educationId, setEducationId] = useState(project?.educationId ?? "");

  // Detailed sections
  const [background, setBackground] = useState(project?.background ?? "");
  const [objectives, setObjectives] = useState(project?.objectives ?? "");
  const [solutions, setSolutions] = useState(project?.solutions ?? "");
  const [architecture, setArchitecture] = useState(project?.architecture ?? "");
  const [challenges, setChallenges] = useState(project?.challenges ?? "");
  const [lessons, setLessons] = useState(project?.lessons ?? "");

  // URLs + flags
  const [repositoryUrl, setRepositoryUrl] = useState(project?.repositoryUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl ?? "");
  const [isPublished, setIsPublished] = useState(project?.isPublished ?? false);
  const [isFeatured, setIsFeatured] = useState(project?.isFeatured ?? false);

  // Relations
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(
    project?.technologies.map((t) => t.technologyId) ?? [],
  );
  const [images, setImages] = useState<ImageEntry[]>(
    project?.images.map((img) => ({
      id: img.id,
      raw: img.imageUrl,
      url: img.imageUrl,
      altText: img.altText ?? "",
      _uid: Math.random().toString(36).substr(2, 9),
    })) ?? [],
  );

  // Auto-slug from title
  useEffect(() => {
    if (!slugManual) setSlug(generateSlug(title));
  }, [title, slugManual]);

  // Thumbnail conversion
  function handleThumbnailChange(val: string) {
    setThumbnailRaw(val);
    setThumbnailErr(false);
    setThumbnailUrl(val ? convertGoogleDriveUrl(val) : "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      thumbnail: thumbnailUrl || null,
      shortDescription: shortDescription.trim() || null,
      fullDescription: fullDescription.trim() || null,
      background: background.trim() || null,
      objectives: objectives.trim() || null,
      solutions: solutions.trim() || null,
      architecture: architecture.trim() || null,
      challenges: challenges.trim() || null,
      lessons: lessons.trim() || null,
      repositoryUrl: repositoryUrl.trim() || null,
      demoUrl: demoUrl.trim() || null,
      isPublished,
      isFeatured,
      experienceId: experienceId || null,
      educationId: educationId || null,
      technologyIds: selectedTechIds,
      images: images.map((img, idx) => ({
        imageUrl: img.url,
        altText: img.altText || null,
        displayOrder: idx,
      })),
    };

    startTransition(async () => {
      const res = isEdit
        ? await updateProjectAction(project!.id, payload)
        : await createProjectAction(payload);

      if (res.success) {
        toast.success(isEdit ? "Project berhasil diperbarui." : "Project berhasil dibuat.");
        if (!isEdit && "data" in res && res.data) {
          router.push(`/admin/projects/${res.data.id}/edit`);
        } else {
          router.refresh();
        }
      } else {
        toast.error("error" in res ? res.error : "Terjadi kesalahan.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Status flags bar ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <span className="text-sm font-medium text-gray-500">Status:</span>
        <ToggleButton
          active={isPublished}
          onLabel="Published"
          offLabel="Draft"
          onIcon={<Eye className="h-4 w-4" />}
          offIcon={<EyeOff className="h-4 w-4" />}
          onClick={() => setIsPublished(!isPublished)}
        />
        <ToggleButton
          active={isFeatured}
          onLabel="Featured"
          offLabel="Tidak Featured"
          onIcon={<Star className="h-4 w-4" />}
          offIcon={<Star className="h-4 w-4 opacity-50" />}
          onClick={() => setIsFeatured(!isFeatured)}
        />
      </div>

      {/* ── Basic Info ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <SectionTitle>Informasi Dasar</SectionTitle>
        <div className="mt-5 grid gap-5">
          {/* Title */}
          <div>
            <Label required>Judul Project</Label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Personal Portfolio Website"
              className={inputCls}
            />
          </div>

          {/* Slug */}
          <div>
            <Label>Slug (URL)</Label>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlugManual(true); setSlug(e.target.value); }}
              placeholder="auto-generated dari judul"
              className={`${inputCls} font-mono`}
            />
            {slugManual && (
              <button
                type="button"
                className="mt-1 text-xs text-blue-500 underline"
                onClick={() => { setSlugManual(false); setSlug(generateSlug(title)); }}
              >
                Reset ke otomatis
              </button>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <Label>Thumbnail (URL atau Google Drive link)</Label>
            <div className="mt-2 flex gap-3">
              <input
                type="text"
                value={thumbnailRaw}
                onChange={(e) => handleThumbnailChange(e.target.value)}
                placeholder="https://… atau drive.google.com/file/d/…"
                className="h-10 flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 placeholder-gray-400 focus:border-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600"
              />
              {thumbnailUrl && (
                <div className="h-10 w-16 overflow-hidden rounded border border-gray-200 dark:border-gray-700 shrink-0">
                  {!thumbnailErr ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnailUrl}
                      alt="thumb"
                      className="h-full w-full object-cover"
                      onError={() => setThumbnailErr(true)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageOff className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                </div>
              )}
            </div>
            {isGoogleDriveLink(thumbnailRaw) && (
              <p className="mt-1 flex items-center gap-1 text-xs text-blue-500">
                <Link2 className="h-3 w-3" /> Google Drive link terdeteksi — dikonversi otomatis.
              </p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <Label>Deskripsi Singkat</Label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={3}
              placeholder="Ringkasan project dalam 1-2 kalimat, tampil di card list."
              className={textareaCls}
            />
          </div>
        </div>
      </div>

      {/* ── Technologies ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <SectionTitle>Teknologi yang Digunakan</SectionTitle>
        <div className="mt-4">
          <TechSelect
            technologies={technologies}
            selected={selectedTechIds}
            onChange={setSelectedTechIds}
          />
        </div>
      </div>

      {/* ── Context Relations ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <SectionTitle>Konteks Hubungan (Opsional)</SectionTitle>
        <p className="mb-4 mt-1 text-xs text-gray-400">
          Tentukan pada saat kapan atau di mana project ini dikerjakan untuk menampilkan relasi yang lebih jelas di profil.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Pilih Pengalaman Kerja</Label>
            <select
              value={experienceId}
              onChange={(e) => setExperienceId(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="">— Tidak terhubung —</option>
              {experiences.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.title} di {exp.company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Pilih Pendidikan</Label>
            <select
              value={educationId}
              onChange={(e) => setEducationId(e.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="">— Tidak terhubung —</option>
              {educations.map((edu) => (
                <option key={edu.id} value={edu.id}>
                  {edu.degree} di {edu.institution}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Gallery ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <SectionTitle>Gallery Screenshot ({images.length} foto)</SectionTitle>
        <p className="mb-4 mt-1 text-xs text-gray-400">
          Simpan foto di Google Drive → bagikan → paste link-nya di sini. Dikonversi otomatis.
        </p>
        <GallerySection images={images} onChange={setImages} />
      </div>

      {/* ── Case Study Sections ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <SectionTitle>Deskripsi Lengkap &amp; Case Study</SectionTitle>
        <div className="mt-5 space-y-5">
          {[
            { label: "Full Description", value: fullDescription, setter: setFullDescription, placeholder: "Penjelasan lengkap tentang project ini…" },
            { label: "Background / Latar Belakang", value: background, setter: setBackground, placeholder: "Masalah atau konteks yang melatarbelakangi project…" },
            { label: "Objectives / Tujuan", value: objectives, setter: setObjectives, placeholder: "Apa yang ingin dicapai dari project ini…" },
            { label: "Solutions / Solusi", value: solutions, setter: setSolutions, placeholder: "Bagaimana solusi yang diimplementasikan…" },
            { label: "Architecture", value: architecture, setter: setArchitecture, placeholder: "Penjelasan arsitektur sistem, tech stack, infrastruktur…" },
            { label: "Challenges / Tantangan", value: challenges, setter: setChallenges, placeholder: "Hambatan yang dihadapi selama pengerjaan…" },
            { label: "Lessons Learned", value: lessons, setter: setLessons, placeholder: "Pelajaran yang didapat dari project ini…" },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <Label>{label}</Label>
              <textarea
                value={value}
                onChange={(e) => setter(e.target.value)}
                rows={4}
                placeholder={placeholder}
                className={textareaCls}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Links ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <SectionTitle>Links</SectionTitle>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Repository URL</Label>
            <input
              type="text"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              placeholder="https://github.com/a/repo1, https://github.com/b/repo2"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-gray-400">Gunakan koma (,) jika ada lebih dari 1 link repository.</p>
          </div>
          <div>
            <Label>Demo URL</Label>
            <input
              type="text"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="Web|https://domain.com, Kaggle|https://kaggle.com"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-gray-400">Pisahkan dengan koma (,) jika &gt; 1. Untuk label khusus gunakan (|) contoh: <code>Vercel|https://...</code></p>
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")} disabled={isPending}>
          ← Kembali
        </Button>
        <Button type="submit" disabled={isPending || !title.trim()}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan…
            </>
          ) : isEdit ? (
            "Simpan Perubahan"
          ) : (
            "Buat Project"
          )}
        </Button>
      </div>
    </form>
  );
}
