"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderGit2, X } from "lucide-react";

export function RelatedProjectsGallery({
  projects,
  limit = 3,
}: {
  projects: { id: string; slug: string; title: string; shortDescription?: string | null }[];
  limit?: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!projects || projects.length === 0) return null;

  const topProjects = projects.slice(0, limit);
  const hasMore = projects.length > limit;

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-black/40">Projects & Case Studies</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group flex flex-col gap-2 rounded-lg border border-black/10 bg-black/[0.03] p-3 transition hover:bg-black/[0.06]"
          >
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 shrink-0 text-black/40" />
              <span className="truncate text-sm font-semibold text-black/80 group-hover:text-black">
                {project.title}
              </span>
            </div>
            {project.shortDescription && (
              <p className="line-clamp-2 text-xs leading-5 text-black/50">
                {project.shortDescription}
              </p>
            )}
          </Link>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 inline-flex items-center text-[13px] font-semibold text-emerald-600 transition hover:text-emerald-700 hover:cursor-pointer"
        >
          Lihat semua {projects.length} project
        </button>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 transition hover:bg-black/5"
            >
              <X className="h-5 w-5 opacity-60" />
            </button>
            <h2 className="text-xl font-semibold">Semua Project Terkait</h2>
            <p className="mt-2 text-sm text-black/60">Daftar semua proyek yang berkaitan dengan entitas ini.</p>
            
            <div className="mt-8 grid gap-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col gap-2 rounded-lg border border-black/10 p-4 transition hover:bg-black/5"
                >
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 shrink-0 text-black/40" />
                    <span className="text-base font-semibold group-hover:text-emerald-600">
                      {project.title}
                    </span>
                  </div>
                  {project.shortDescription && (
                    <p className="mt-1 text-sm leading-relaxed text-black/60">
                      {project.shortDescription}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
