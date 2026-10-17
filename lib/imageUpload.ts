import imageCompression from 'browser-image-compression';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface UploadProgressInfo {
  fileName: string;
  originalSize: number;
  compressedSize: number;
  progress: number; // 0 to 100
  status: 'compressing' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  url?: string;
}

export const STORAGE_BUCKET = 'property-images';

/**
 * Strict Supabase Free-Tier Compression Configuration
 * Constrains each image to max 150KB and converts to WebP.
 */
export const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.15, // 150 KB
  maxWidthOrHeight: 1920,
  fileType: 'image/webp' as const,
  initialQuality: 0.8,
  useWebWorker: true,
};

/**
 * Compresses an image client-side to < 150KB WebP
 */
export async function compressImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ compressedFile: File; originalSize: number; compressedSize: number }> {
  const originalSize = file.size;

  const compressedBlob = await imageCompression(file, {
    ...COMPRESSION_OPTIONS,
    onProgress: (percent) => {
      if (onProgress) {
        onProgress(Math.round(percent * 0.5)); // First 50% is compression
      }
    },
  });

  // Ensure file is converted to File object with .webp extension
  const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const compressedFile = new File([compressedBlob], `${cleanName}.webp`, {
    type: 'image/webp',
  });

  return {
    compressedFile,
    originalSize,
    compressedSize: compressedFile.size,
  };
}

/**
 * Client-side utility that intercepts ALL selected images,
 * compresses them to <150KB WebP, and uploads to Supabase Storage.
 * 
 * Path format: ${reference_code}/${timestamp}-${random}.webp
 * Cache-Control: '31536000' (1 year)
 */
export async function uploadPropertyImage(
  file: File,
  referenceCode: string,
  onProgressUpdate?: (info: UploadProgressInfo) => void
): Promise<{ url: string; path: string; originalSize: number; compressedSize: number }> {
  const sanitizedRef = referenceCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '') || 'RES-TEMP';
  const originalSize = file.size;

  onProgressUpdate?.({
    fileName: file.name,
    originalSize,
    compressedSize: 0,
    progress: 10,
    status: 'compressing',
  });

  // 1. Compress Image
  const { compressedFile, compressedSize } = await compressImage(file, (p) => {
    onProgressUpdate?.({
      fileName: file.name,
      originalSize,
      compressedSize: 0,
      progress: Math.min(p, 50),
      status: 'compressing',
    });
  });

  onProgressUpdate?.({
    fileName: file.name,
    originalSize,
    compressedSize,
    progress: 50,
    status: 'uploading',
  });

  // 2. Generate Supabase storage path: ${reference_code}/${timestamp}-${random}.webp
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const filePath = `${sanitizedRef}/${timestamp}-${randomSuffix}.webp`;

  // Fallback if Supabase is not yet configured with valid credentials
  if (!isSupabaseConfigured) {
    // Generate an object URL / data URL for client preview during prototyping
    const previewUrl = URL.createObjectURL(compressedFile);
    onProgressUpdate?.({
      fileName: file.name,
      originalSize,
      compressedSize,
      progress: 100,
      status: 'completed',
      url: previewUrl,
    });
    return {
      url: previewUrl,
      path: filePath,
      originalSize,
      compressedSize,
    };
  }

  // 3. Upload to Supabase Storage with 1 year cache
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, compressedFile, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year cache
      upsert: false,
    });

  if (uploadError) {
    onProgressUpdate?.({
      fileName: file.name,
      originalSize,
      compressedSize,
      progress: 100,
      status: 'error',
      errorMessage: uploadError.message,
    });
    throw new Error(`فشل رفع الصورة: ${uploadError.message}`);
  }

  // 4. Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  onProgressUpdate?.({
    fileName: file.name,
    originalSize,
    compressedSize,
    progress: 100,
    status: 'completed',
    url: publicUrl,
  });

  return {
    url: publicUrl,
    path: filePath,
    originalSize,
    compressedSize,
  };
}

/**
 * Extracts storage relative file path from public URL
 */
export function extractStoragePath(urlOrPath: string): string | null {
  if (!urlOrPath) return null;
  if (!urlOrPath.startsWith('http')) return urlOrPath;

  const bucketMatch = urlOrPath.indexOf(`/${STORAGE_BUCKET}/`);
  if (bucketMatch !== -1) {
    return decodeURIComponent(urlOrPath.substring(bucketMatch + STORAGE_BUCKET.length + 2));
  }
  return null;
}

/**
 * Delete images from Supabase Storage
 */
export async function deleteStorageFiles(urlsOrPaths: string[]): Promise<boolean> {
  if (!isSupabaseConfigured || urlsOrPaths.length === 0) return true;

  const validPaths = urlsOrPaths
    .map(extractStoragePath)
    .filter((p): p is string => Boolean(p));

  if (validPaths.length === 0) return true;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(validPaths);
  if (error) {
    console.error('Error deleting files from storage:', error);
    return false;
  }
  return true;
}

/**
 * "Mark as Sold & Clean Storage"
 * When a property is marked as sold, automatically deletes all secondary images
 * (images[1..n]) from the property-images bucket, preserving ONLY images[0].
 * Returns the cleaned array containing only the primary thumbnail.
 */
export async function cleanSecondaryImagesForSoldProperty(
  images: string[]
): Promise<string[]> {
  if (!images || images.length <= 1) {
    return images || [];
  }

  const primaryThumbnail = images[0];
  const secondaryImages = images.slice(1);

  // Delete secondary images from storage
  await deleteStorageFiles(secondaryImages);

  // Return array with only the thumbnail
  return [primaryThumbnail];
}
