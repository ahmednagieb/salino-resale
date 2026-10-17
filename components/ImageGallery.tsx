'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Maximize2, X, Image as ImageIcon } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const displayImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-3">
      
      {/* Main Image View */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200">
        <img
          src={currentImage}
          alt={`${title} - صورة ${selectedIndex + 1}`}
          loading="eager"
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Counter Badge */}
        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-md">
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>{selectedIndex + 1} / {displayImages.length}</span>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-white p-2 rounded-xl hover:bg-slate-900 border border-white/10 transition-colors shadow-md"
          title="عرض ملء الشاشة"
        >
          <Maximize2 className="w-4 h-4 text-amber-400" />
        </button>

        {/* Arrows (if multiple images) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-900 text-white p-2.5 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              aria-label="الصورة السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-900 text-white p-2.5 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              aria-label="الصورة التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative shrink-0 w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? 'border-amber-500 scale-102 shadow-md'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`صورة مصغرة ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 left-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={currentImage}
              alt={title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white p-3 rounded-full backdrop-blur-md transition-transform hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white p-3 rounded-full backdrop-blur-md transition-transform hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
