'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Maximize2, X, Image as ImageIcon, Camera } from 'lucide-react';

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

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') handlePrev();
      if (e.key === 'ArrowLeft') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLightboxOpen, displayImages.length]);

  return (
    <div className="space-y-3">
      
      {/* Main Image View */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-200 group">
        <img
          src={currentImage}
          alt={`${title} - صورة ${selectedIndex + 1}`}
          loading="eager"
          className="w-full h-full object-cover transition-all duration-500 cursor-zoom-in group-hover:scale-102"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-md">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>{selectedIndex + 1} من {displayImages.length} صور</span>
        </div>

        {/* Fullscreen Trigger Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-white p-2.5 rounded-xl hover:bg-slate-900 border border-white/10 transition-colors shadow-md cursor-pointer"
          title="عرض ملء الشاشة (Lightbox)"
          aria-label="عرض ملء الشاشة"
        >
          <Maximize2 className="w-4 h-4 text-amber-400" />
        </button>

        {/* Arrows (if multiple images) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-900 text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              aria-label="الصورة السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-900 text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              aria-label="الصورة التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative shrink-0 w-20 sm:w-28 aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? 'border-amber-500 scale-102 shadow-lg ring-2 ring-amber-400/30'
                  : 'border-transparent opacity-65 hover:opacity-100'
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
        <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 left-5 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="إغلاق (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute top-6 text-slate-300 text-xs font-mono font-bold bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            {selectedIndex + 1} / {displayImages.length}
          </div>

          <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={currentImage}
              alt={title}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3.5 rounded-full backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
                  title="السابق (سهم يمين)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3.5 rounded-full backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
                  title="التالي (سهم يسار)"
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
