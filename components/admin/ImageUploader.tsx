'use client';

import { useState, useRef } from 'react';
import { uploadPropertyImage, UploadProgressInfo } from '@/lib/imageUpload';
import { formatFileSize } from '@/lib/utils';
import { 
  UploadCloud, 
  Trash2, 
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ImageUploaderProps {
  referenceCode: string;
  existingImages: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({
  referenceCode,
  existingImages = [],
  onChange,
}: ImageUploaderProps) {
  const { t, lang, isRTL } = useLanguage();
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploadQueue, setUploadQueue] = useState<UploadProgressInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Initialize queue entries
    const initialQueue: UploadProgressInfo[] = fileArray.map((file) => ({
      fileName: file.name,
      originalSize: file.size,
      compressedSize: 0,
      progress: 0,
      status: 'compressing',
    }));

    setUploadQueue((prev) => [...prev, ...initialQueue]);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      try {
        const result = await uploadPropertyImage(file, referenceCode, (progressInfo) => {
          setUploadQueue((currentQueue) =>
            currentQueue.map((item) =>
              item.fileName === file.name ? { ...item, ...progressInfo } : item
            )
          );
        });

        // Add to images state
        setImages((prev) => {
          const updated = [...prev, result.url];
          onChange(updated);
          return updated;
        });
      } catch (err: unknown) {
        setUploadQueue((currentQueue) =>
          currentQueue.map((item) =>
            item.fileName === file.name
              ? {
                  ...item,
                  status: 'error',
                  errorMessage: err instanceof Error ? err.message : (lang === 'ar' ? 'خطأ أثناء الرفع' : 'Upload error'),
                }
              : item
          )
        );
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      onChange(updated);
      return updated;
    });
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    setImages((prev) => {
      const primary = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      const updated = [primary, ...rest];
      onChange(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      
      {/* Supabase Free-Tier Optimization Notice Banner */}
      <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-4 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">
              {lang === 'ar'
                ? 'نظام ضغط الصور التلقائي المتطور (Supabase Free-Tier Optimizer):'
                : 'Automatic Image Compression (Supabase Free-Tier Optimizer):'}
            </span>
            <span>
              {lang === 'ar'
                ? 'يتم تحويل كافة الصور في المتصفح إلى صيغة WebP متقدمة بحجم أقصى 150KB لحماية مساحة وحركة بيانات السحابة المجانية.'
                : 'All photos are converted client-side into modern WebP (max 150KB) to protect free-tier storage & bandwidth.'}
            </span>
          </div>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/40 shrink-0">
          Max 150 KB • WebP
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-md">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {t('admin.upload.dragText')}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {t('admin.upload.specs')}
            </p>
          </div>
        </div>
      </div>

      {/* Active Upload & Compression Progress Queue */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2 bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
          <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {lang === 'ar' ? 'حالة المعالجة وضغط الصور:' : 'Processing & Compression Queue:'}
          </h5>

          <div className="space-y-2.5">
            {uploadQueue.map((item, idx) => {
              const savings = item.originalSize && item.compressedSize
                ? Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100)
                : 0;

              return (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-medium truncate max-w-[200px]" title={item.fileName}>
                      {item.fileName}
                    </span>

                    {/* Before & After File Size Tag */}
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-slate-400">{formatFileSize(item.originalSize)}</span>
                      {item.compressedSize > 0 && (
                        <>
                          <ArrowRight className={`w-3 h-3 text-amber-400 ${isRTL ? 'rotate-180' : ''}`} />
                          <span className="text-emerald-400 font-bold">
                            {formatFileSize(item.compressedSize)}
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded">
                            {t('admin.upload.savedPct').replace('{pct}', savings.toString())}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.status === 'error'
                          ? 'bg-rose-500'
                          : item.status === 'completed'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      {item.status === 'compressing' && t('admin.upload.compressing')}
                      {item.status === 'uploading' && t('admin.upload.uploading')}
                      {item.status === 'completed' && t('admin.upload.done')}
                      {item.status === 'error' && (item.errorMessage || (lang === 'ar' ? 'فشل الرفع' : 'Upload failed'))}
                    </span>
                    <span>{item.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Uploaded Images Gallery */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>
              {lang === 'ar' ? `الصور المرفوعة (${images.length})` : `Uploaded Photos (${images.length})`}
            </span>
            <span className="text-amber-400 font-normal text-[11px]">
              {lang === 'ar' ? '* أول صورة هي الصورة الرئيسية (Hero)' : '* First photo is the primary hero image'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className={`relative group aspect-[16/10] rounded-xl overflow-hidden border-2 bg-slate-900 ${
                  idx === 0 ? 'border-amber-500 shadow-md shadow-amber-500/20' : 'border-slate-700'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Badge */}
                {idx === 0 && (
                  <span className="absolute top-1.5 end-1.5 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                    {t('admin.upload.mainBadge')}
                  </span>
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-1 rounded hover:bg-amber-400 cursor-pointer"
                      title={lang === 'ar' ? 'تعيين كصورة رئيسية' : 'Set as hero image'}
                    >
                      {lang === 'ar' ? 'تعيين كرئيسية' : 'Set Hero'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer"
                    title={t('admin.upload.deleteImg')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
