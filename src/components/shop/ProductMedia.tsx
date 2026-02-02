"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const Product3DViewer = dynamic(
  () => import("./Product3DViewer"),
  { ssr: false, loading: () => <div className="w-full h-full min-h-[200px] bg-slate-200 rounded-2xl animate-pulse flex items-center justify-center text-slate-500 text-sm">Loading 3D…</div> }
);

type ViewMode = "photos" | "video" | "model3d";

const AUTO_ADVANCE_MS = 4000;

export default function ProductMedia({
  images,
  primaryImage,
  videoUrl,
  model3dUrl,
  productName,
}: {
  images: { url: string; alt?: string }[];
  primaryImage: string;
  videoUrl?: string;
  model3dUrl?: string;
  productName: string;
}) {
  const urls = images.length > 0 ? images.map((i) => i.url) : [primaryImage].filter(Boolean);
  const hasPhotos = urls.length > 0;
  const initialView: ViewMode = hasPhotos ? "photos" : (model3dUrl ? "model3d" : videoUrl ? "video" : "photos");
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance photos when viewing photos and more than one image
  useEffect(() => {
    if (viewMode !== "photos" || urls.length <= 1) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % urls.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [viewMode, urls.length]);

  const selectPhoto = (i: number) => {
    setViewMode("photos");
    setActiveIndex(i);
  };
  const selectVideo = () => setViewMode("video");
  const selectModel3d = () => setViewMode("model3d");

  return (
    <div className="space-y-4">
      {/* Main view area – clear box outline, shows selected photo / video / 3D */}
      <div
        className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-50 shadow-inner group ring-2 ring-slate-200/80"
        style={{ backgroundColor: "rgb(240 249 255)" }}
      >
        {viewMode === "photos" && hasPhotos && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                key={urls[activeIndex]}
                src={urls[activeIndex]}
                alt={productName}
                fill
                className="object-contain transition-opacity duration-500 ease-out"
                unoptimized={urls[activeIndex]?.startsWith("http")}
                priority
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
            {urls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => (i - 1 + urls.length) % urls.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-slate-700"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((i) => (i + 1) % urls.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-slate-700"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </>
        )}
        {viewMode === "video" && videoUrl && (
          <div className="absolute inset-0 bg-slate-900">
            <iframe
              src={
                videoUrl.includes("youtube.com")
                  ? videoUrl.replace("watch?v=", "embed/")
                  : videoUrl
              }
              title="Product video"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {viewMode === "model3d" && model3dUrl && (
          <div className="absolute inset-0 w-full h-full min-h-[280px]">
            <Product3DViewer url={model3dUrl} />
          </div>
        )}
      </div>

      {/* Thumbnails row: photo squares + video square + 3D square – outlined */}
      <div className="flex flex-wrap items-stretch gap-2">
        {urls.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => selectPhoto(i)}
            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
              viewMode === "photos" && activeIndex === i
                ? "border-[#BF0637] ring-2 ring-[#BF0637]/30"
                : "border-slate-300 hover:border-slate-400"
            }`}
          >
            <Image
              src={url}
              alt=""
              fill
              className="object-cover"
              unoptimized={url.startsWith("http")}
              sizes="64px"
            />
          </button>
        ))}
        {videoUrl && (
          <button
            type="button"
            onClick={selectVideo}
            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 flex items-center justify-center bg-slate-800 ${
              viewMode === "video"
                ? "border-[#BF0637] ring-2 ring-[#BF0637]/30"
                : "border-slate-300 hover:border-slate-500"
            }`}
            title="Product video"
          >
            <svg className="w-6 h-6 text-white/90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
        {model3dUrl && (
          <button
            type="button"
            onClick={selectModel3d}
            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 flex items-center justify-center bg-slate-700 ${
              viewMode === "model3d"
                ? "border-[#BF0637] ring-2 ring-[#BF0637]/30"
                : "border-slate-300 hover:border-slate-500"
            }`}
            title="360° View"
          >
            <span className="text-white/90 text-xs font-semibold">360°</span>
          </button>
        )}
      </div>
    </div>
  );
}
