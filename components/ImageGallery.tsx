'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronRight, ChevronLeft, Maximize2, X, Camera } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { lang, dir } = useLanguage();

  const displayImages = images && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        if (dir === 'rtl') handlePrev();
        else handleNext();
      }
      if (e.key === 'ArrowLeft') {
        if (dir === 'rtl') handleNext();
        else handlePrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLightboxOpen, dir, handleNext, handlePrev]);

  return (
    <div className="space-y-3">
      
      {/* Main Image View */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-200 group">
        <img
          src={currentImage}
          alt={`${title} - ${selectedIndex + 1}`}
          loading="eager"
          className="w-full h-full object-cover transition-all duration-500 cursor-zoom-in group-hover:scale-102"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute top-4 end-4 bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-md">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {lang === 'en'
              ? `${selectedIndex + 1} of ${displayImages.length} photos`
              : `${selectedIndex + 1} من ${displayImages.length} صور`}
          </span>
        </div>

        {/* Fullscreen Trigger Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 start-4 bg-slate-950/85 backdrop-blur-md text-white p-2.5 rounded-xl hover:bg-slate-900 border border-white/10 transition-colors shadow-md cursor-pointer"
          title={lang === 'en' ? 'Fullscreen Lightbox' : 'عرض ملء الشاشة (Lightbox)'}
          aria-label="Fullscreen"
        >
          <Maximize2 className="w-4 h-4 text-amber-400" />
        </button>

        {/* Arrows (if multiple images) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute end-4 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-900 text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              aria-label="Previous"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <button
              onClick={handleNext}
              className="absolute start-4 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-900 text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
              aria-label="Next"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
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
                alt={`Thumbnail ${idx + 1}`}
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
            className="absolute top-5 start-5 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="Close (Esc)"
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
                  className="absolute end-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3.5 rounded-full backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
                  title="Previous"
                >
                  <ChevronRight className="w-6 h-6 rtl:rotate-0 ltr:rotate-180" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute start-4 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/30 text-white p-3.5 rounded-full backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
                  title="Next"
                >
                  <ChevronLeft className="w-6 h-6 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
