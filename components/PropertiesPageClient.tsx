'use client';

import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import QuickFilter from '@/components/QuickFilter';
import { useLanguage } from '@/context/LanguageContext';
import { Compound, ResaleProperty } from '@/types/database';
import { Search, ArrowUpDown } from 'lucide-react';

interface PropertiesPageClientProps {
  properties: ResaleProperty[];
  compounds: Compound[];
  resolvedParams: Record<string, string | undefined>;
}

export default function PropertiesPageClient({
  properties,
  compounds,
  resolvedParams,
}: PropertiesPageClientProps) {
  const { lang, t, translateArea } = useLanguage();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
            <Link href="/" className="hover:underline">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-slate-800">{t('nav.properties')}</span>
            {resolvedParams.area && (
              <>
                <span>/</span>
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {translateArea(resolvedParams.area)}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {lang === 'en' ? 'Resale Real Estate Marketplace in Egypt' : 'سوق عقارات الريسيل في مصر'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {lang === 'en' ? (
                  <>Showing <strong className="text-slate-900 font-bold">{properties.length} verified units</strong> directly from owners with full payment schedule</>
                ) : (
                  <>عرض <strong className="text-slate-900 font-bold">{properties.length} وحدة</strong> معتمدة مباشرة من الملاك مع تفاصيل المقدم والأقساط</>
                )}
              </p>
            </div>

            {/* Quick Sort Controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold me-1 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Sort by:' : 'ترتيب حسب:'}
              </span>
              
              <Link
                href={`/properties?${new URLSearchParams({ ...resolvedParams, sortBy: 'down_payment_asc' } as Record<string, string>).toString()}`}
                className={`px-3.5 py-2 rounded-xl border font-bold transition-all ${
                  resolvedParams.sortBy === 'down_payment_asc'
                    ? 'bg-slate-900 border-slate-900 text-amber-400 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {lang === 'en' ? 'Lowest Cash Down First' : 'الأقل مقدم كاش أولاً'}
              </Link>

              <Link
                href={`/properties?${new URLSearchParams({ ...resolvedParams, sortBy: 'total_price_asc' } as Record<string, string>).toString()}`}
                className={`px-3.5 py-2 rounded-xl border font-bold transition-all ${
                  resolvedParams.sortBy === 'total_price_asc'
                    ? 'bg-slate-900 border-slate-900 text-amber-400 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {lang === 'en' ? 'Lowest Total Price' : 'الأقل سعراً إجمالياً'}
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Control Box */}
        <QuickFilter
          compounds={compounds}
          initialValues={resolvedParams}
          isCompact={true}
        />

        {/* Results Section */}
        {properties.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {lang === 'en' ? 'No units match these filters' : 'لم نعثر على وحدات تطابق هذه الفلاتر'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'en'
                ? 'Try widening your search criteria such as increasing the max cash down payment or selecting all areas.'
                : 'جرب توسيع معايير البحث مثل زيادة الحد الأقصى للمقدم الكاش أو اختيار كل المناطق.'}
            </p>
            <Link
              href="/properties"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors"
            >
              {lang === 'en' ? 'View All Available Units' : 'عرض كافة الوحدات المعروضة'}
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
