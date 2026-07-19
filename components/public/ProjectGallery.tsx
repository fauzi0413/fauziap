"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, X } from "lucide-react";
import { EmptyState } from "@/components/public/EmptyState";

interface ProjectGalleryProps {
  images: { id: string; imageUrl: string; altText: string | null }[];
  projectTitle: string;
}

export function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) {
    return <EmptyState title="Gallery belum terisi" description="Silahkan tambahkan gambar projek untuk melengkapi halaman ini." />;
  }

  const displayedImages = showAll ? images : images.slice(0, 6);

  return (
    <div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {displayedImages.map((image) => (
          <div 
            key={image.id} 
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-black/10 bg-white"
            onClick={() => setSelectedImage(image.imageUrl)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.imageUrl} alt={image.altText ?? projectTitle} className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
        ))}
      </div>

      {images.length > 6 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-black/5"
          >
            {showAll ? (
              <>Tampilkan lebih sedikit <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Lihat semua <ChevronDown className="h-4 w-4" /></>
            )}
          </button>
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()} // Prevent clicking the image from closing the modal
          >
            <button 
              className="absolute -right-2 -top-12 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 md:-right-12 md:top-0"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedImage} 
              alt="Detail pop up" 
              className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
