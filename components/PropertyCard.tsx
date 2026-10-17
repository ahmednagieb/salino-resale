'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResaleProperty } from '@/types/database';
import { formatEGP, generateWhatsAppLink } from '@/lib/utils';
import { 
  Building, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  MessageCircle, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
  Copy,
  Check
} from 'lucide-react';

interface PropertyCardProps {
  property: ResaleProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('salino_favorites') || '[]');
      setIsFavorite(favs.includes(property.id));
    } catch {
      // LocalStorage access fallback
    }
  }, [property.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const favs = JSON.parse(localStorage.getItem('salino_favorites') || '[]');
      let updated: string[];
      if (favs.includes(property.id)) {
        updated = favs.filter((id: string) => id !== property.id);
        setIsFavorite(false);
      } else {
        updated = [...favs, property.id];
        setIsFavorite(true);
      }
      localStorage.setItem('salino_favorites', JSON.stringify(updated));
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(property.reference_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const thumbnail = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const isSold = property.status === 'sold';
  const whatsappUrl = generateWhatsAppLink(
    property.reference_code,
    property.title_ar,
    property.id
  );

  // Financial percentages for visual equity bar
  const total = property.total_price || (property.total_down_payment + property.remaining_installments) || 1;
  const downPaymentPercent = Math.min(100, Math.max(5, Math.round((property.total_down_payment / total) * 100)));
  const installmentsPercent = 100 - downPaymentPercent;

  return (
    <div className={`group glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
      isSold ? 'opacity-85 border-slate-200' : 'hover:border-amber-400/60 hover:shadow-2xl hover:-translate-y-1'
    }`}>
      
      {/* Top Media Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={thumbnail}
          alt={property.title_ar}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Top Floating Bar: Reference Code & Badges */}
        <div className="absolute top-3.5 right-3.5 left-3.5 flex items-center justify-between gap-2 z-10">
          
          {/* Reference Code with Copy button */}
          <button
            onClick={handleCopyCode}
            type="button"
            className="bg-slate-950/85 backdrop-blur-md text-amber-400 font-mono font-bold text-xs px-2.5 py-1 rounded-xl border border-slate-700/80 shadow-md flex items-center gap-1.5 hover:bg-slate-900 transition-colors cursor-pointer"
            title="نسخ كود الوحدة"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[10px]">تم النسخ!</span>
              </>
            ) : (
              <>
                <span>{property.reference_code}</span>
                <Copy className="w-3 h-3 text-slate-400 group-hover/btn:text-amber-400" />
              </>
            )}
          </button>

          {/* Right Badges & Favorite */}
          <div className="flex items-center gap-2">
            {property.is_featured && !isSold && (
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3 text-slate-950" />
                لقطة
              </span>
            )}
            
            {isSold ? (
              <span className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-md">
                تم البيع
              </span>
            ) : (
              <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                متاح ريسيل
              </span>
            )}

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              type="button"
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md cursor-pointer ${
                isFavorite 
                  ? 'bg-rose-500 text-white scale-105' 
                  : 'bg-slate-950/60 hover:bg-slate-950/90 text-white/80 hover:text-white'
              }`}
              title={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
              aria-label="المفضلة"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Delivery Badge on Image */}
        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs pointer-events-none z-10">
          <span className="bg-slate-950/80 backdrop-blur-md text-slate-200 text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/10">
            <Clock className="w-3 h-3 text-amber-400" />
            {property.delivery_status}
          </span>

          <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/10">
            {property.property_type}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Compound & Title */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1 text-amber-700 font-bold">
              <Building className="w-3.5 h-3.5 text-amber-500" />
              {property.compound?.name_ar || 'كمبوند فاخر'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {property.compound?.area_name || 'القاهرة الجديدة'}
            </span>
          </div>

          <Link href={`/properties/${property.id}`} className="block group-hover:text-amber-800 transition-colors">
            <h3 className="font-black text-slate-900 text-base leading-snug line-clamp-2">
              {property.title_ar}
            </h3>
          </Link>
        </div>

        {/* 3 Core Resale Financial Metrics (The Resale USP) */}
        <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5">
          
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>بيانات السداد والريسيل:</span>
            {property.installment_years_left > 0 ? (
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                أقساط على {property.installment_years_left} سنوات
              </span>
            ) : (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                خالص الأقساط بالكامل
              </span>
            )}
          </div>

          {/* 3 Micro Cards */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            
            {/* 1. Cash Down Payment (المطلوب كاش الآن) */}
            <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-xl p-2 flex flex-col justify-center">
              <span className="text-[10px] font-black text-emerald-800">
                المطلوب كاش
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-950 mt-0.5 font-mono">
                {formatEGP(property.total_down_payment)}
              </span>
              <span className="text-[9px] text-emerald-700 font-medium">مقدم + أوفر</span>
            </div>

            {/* 2. Remaining Installments (المتبقي أقساط) */}
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-2 flex flex-col justify-center">
              <span className="text-[10px] font-black text-amber-800">
                المتبقي أقساط
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-950 mt-0.5 font-mono">
                {formatEGP(property.remaining_installments)}
              </span>
              <span className="text-[9px] text-amber-700 font-medium">للمطور مباشرة</span>
            </div>

            {/* 3. Total Price (السعر الإجمالي) */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-600">
                السعر الإجمالي
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 font-mono">
                {formatEGP(property.total_price)}
              </span>
              <span className="text-[9px] text-slate-500 font-medium">شامل الأوفر</span>
            </div>

          </div>

          {/* Visual Equity Ratio Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${downPaymentPercent}%` }} 
                className="h-full bg-emerald-500 transition-all duration-500" 
                title={`الكاش المطلوب الآن: ${downPaymentPercent}%`}
              />
              <div 
                style={{ width: `${installmentsPercent}%` }} 
                className="h-full bg-amber-400 transition-all duration-500" 
                title={`المتبقي أقساط للمطور: ${installmentsPercent}%`}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-medium">
              <span className="text-emerald-700 font-bold">{downPaymentPercent}% كاش الآن</span>
              <span className="text-amber-700 font-bold">{installmentsPercent}% أقساط مطور</span>
            </div>
          </div>

        </div>

        {/* Specs Row */}
        <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold">{property.area_sqm} م²</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold">{property.bedrooms} غرف</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold">{property.bathrooms} حمام</span>
          </div>
          <div className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
            {property.finishing_type}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-1 flex items-center gap-2">
          {/* WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
            <span>استفسار واتساب</span>
          </a>

          {/* Details CTA */}
          <Link
            href={`/properties/${property.id}`}
            className="flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl transition-all hover:gap-1.5"
          >
            <span>التفاصيل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
