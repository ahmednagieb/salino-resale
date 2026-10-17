/**
 * Utility functions for Egyptian Real Estate Resale App
 */

export function formatEGP(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 ج.م';
  }
  const formatted = new Intl.NumberFormat('ar-EG', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ج.م`;
}

export function formatNumber(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  return new Intl.NumberFormat('ar-EG').format(amount);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function generateWhatsAppLink(
  referenceCode: string,
  title: string,
  propertyId: string,
  customPhone?: string
): string {
  const phone = customPhone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201000000000';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  
  // Construct site URL or placeholder
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://salino-resale.com';
  const propertyUrl = `${siteUrl}/properties/${propertyId}`;

  const message = `السلام عليكم ورحمة الله،
أنا مهتم بالوحدة ريسيل كود (${referenceCode}) - ${title}
رابط الوحدة: ${propertyUrl}

برجاء تزويدي بكافة تفاصيل السداد والمقدم والأقساط، وموعد المعاينة.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateReferenceCode(existingCount = 0): string {
  const nextNum = 100 + existingCount + 1;
  return `RES-${nextNum}`;
}
