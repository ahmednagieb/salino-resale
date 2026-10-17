'use client';

import Link from 'next/link';
import { ResaleProperty } from '@/types/database';
import { formatEGP, generateWhatsAppLink } from '@/lib/utils';
import { 
  Building, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  MessageCircle, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface PropertyCardProps {
  property: ResaleProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const thumbnail = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const isSold = property.status === 'sold';
  const whatsappUrl = generateWhatsAppLink(
    property.reference_code,
    property.title_ar,
    property.id
  );

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${
      isSold ? 'border-slate-200 opacity-80' : 'border-slate-200 hover:border-amber-400/60'
    }`}>
      
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={thumbnail}
          alt={property.title_ar}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="bg-slate-900/90 text-amber-400 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-700/80 shadow-sm backdrop-blur-md">
            {property.reference_code}
          </span>

          <div className="flex items-center gap-1.5">
            {property.is_featured && !isSold && (
              <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                مميزة
              </span>
            )}
            
            {isSold ? (
              <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                تم البيع
              </span>
            ) : (
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
                متاح ريسيل
              </span>
            )}
          </div>
        </div>

        {/* Delivery Status Bottom Tag */}
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <span className="bg-slate-900/85 backdrop-blur-md text-slate-200 text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {property.delivery_status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Compound & Area */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <span className="flex items-center gap-1 text-amber-800 font-semibold">
              <Building className="w-3.5 h-3.5" />
              {property.compound?.name_ar || 'كمبوند راقي'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {property.compound?.area_name || 'القاهرة الجديدة'}
            </span>
          </div>

          {/* Title */}
          <Link href={`/properties/${property.id}`} className="block group-hover:text-amber-800 transition-colors">
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
              {property.title_ar}
            </h3>
          </Link>
        </div>

        {/* 3 Core Resale Financial Badges (CRITICAL) */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>بيانات السداد والريسيل:</span>
            {property.installment_years_left > 0 && (
              <span className="text-amber-800 font-bold">
                أقساط على {property.installment_years_left} سنوات
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
            {/* 1. Cash Down Payment (المطلوب كاش الآن) */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-2 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-emerald-800">
                المطلوب كاش الآن
              </span>
              <span className="text-sm font-black text-emerald-900 mt-0.5">
                {formatEGP(property.total_down_payment)}
              </span>
              <span className="text-[9px] text-emerald-700">مقدم + أوفر</span>
            </div>

            {/* 2. Remaining Installments (المتبقي أقساط) */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-lg p-2 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-amber-800">
                المتبقي أقساط
              </span>
              <span className="text-sm font-black text-amber-900 mt-0.5">
                {formatEGP(property.remaining_installments)}
              </span>
              <span className="text-[9px] text-amber-700">للمطور مباشرة</span>
            </div>

            {/* 3. Total Price (السعر الإجمالي) */}
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-2 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-700">
                السعر الإجمالي
              </span>
              <span className="text-sm font-black text-slate-900 mt-0.5">
                {formatEGP(property.total_price)}
              </span>
              <span className="text-[9px] text-slate-600">شامل الأوفر</span>
            </div>
          </div>
        </div>

        {/* Specs Row */}
        <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">{property.area_sqm} م²</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">{property.bedrooms} غرف</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">{property.bathrooms} حمام</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
            {property.finishing_type}
          </div>
        </div>

        {/* CTAs */}
        <div className="pt-1 flex items-center gap-2">
          {/* WhatsApp Direct CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            استفسار واتساب
          </a>

          {/* Details CTA */}
          <Link
            href={`/properties/${property.id}`}
            className="flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all hover:gap-1.5"
          >
            <span>التفاصيل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
