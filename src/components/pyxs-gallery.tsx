"use client";

import Image from "next/image";
import { useState } from "react";

interface Photo {
  url: string;
  title?: string;
}

export function PyxsGallery({ photos, profileName }: { photos: Photo[]; profileName: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");

  const openLightbox = (src: string) => {
    setSelectedImg(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, i) => (
          <div
            key={photo.url}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer"
            onClick={() => openLightbox(photo.url)}
            style={{
              transition: "all 0.4s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "scale(1.05)";
              el.style.boxShadow = "0 0 30px rgba(236, 72, 153, 0.6)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = "scale(1)";
              el.style.boxShadow = "none";
            }}
          >
            <Image
              src={photo.url}
              alt={photo.title || `${profileName} — ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-8 right-8 text-5xl text-white hover:text-pink-400 transition"
          >
            ✕
          </button>
          <div
            className="relative max-h-[90vh] max-w-[95vw] rounded-2xl overflow-hidden"
            style={{ width: "min(95vw, 1200px)", height: "min(90vh, 80vh)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImg}
              alt="Lightbox"
              fill
              className="object-contain"
              sizes="95vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
