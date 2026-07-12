"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPeriod } from "@/components/public/format";
import { Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import type { Experience } from "@prisma/client";

interface RelatedExperiencesListProps {
  experiences: Experience[];
}

export function RelatedExperiencesList({ experiences }: RelatedExperiencesListProps) {
  const [showAll, setShowAll] = useState(false);

  if (!experiences || experiences.length === 0) return null;

  // Sort: prioritize featured, then database order
  const sortedExps = [...experiences].sort((a, b) => {
    // @ts-ignore
    if (a.isFeatured && !b.isFeatured) return -1;
    // @ts-ignore
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  const displayedExps = showAll ? sortedExps : sortedExps.slice(0, 3);
  const hasMore = sortedExps.length > 3;

  return (
    <div className="mt-5 border-t border-black/5 pt-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-black/40">
        Pengalaman Selama Masa Studi
      </h3>
      <div className="grid gap-3">
        {displayedExps.map((exp) => (
          <Link
            href={`/experience#${exp.id}`}
            key={exp.id}
            className="group -ml-2 flex items-start gap-3 rounded-md p-2 transition hover:bg-black/5"
          >
            {exp.companyLogo && exp.companyLogo.startsWith("http") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={exp.companyLogo}
                alt={exp.company}
                className="h-8 w-8 shrink-0 rounded border border-black/10 bg-white object-contain p-0.5"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-black/10 bg-black/5">
                <Briefcase className="h-4 w-4 text-black/40" />
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-gray-900 transition group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {exp.title}
              </p>
              <p className="truncate text-xs text-gray-500">
                {exp.company} · {formatPeriod(exp.startDate, exp.endDate)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          {showAll ? (
            <>
              Lihat lebih sedikit <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Lihat semua {sortedExps.length} pengalaman <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
