import PropertyCard from '@/components/PropertyCard';
import QuickFilter from '@/components/QuickFilter';
import { getProperties, getCompounds } from '@/lib/dataService';
import { Building2, Search, SlidersHorizontal, ArrowUpDown, Filter, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PropertiesPageProps {
  searchParams: Promise<{
    area?: string;
    compoundId?: string;
    propertyType?: string;
    maxDownPayment?: string;
    maxTotalPrice?: string;
    deliveryStatus?: string;
    query?: string;
    sortBy?: 'down_payment_asc' | 'total_price_asc' | 'newest';
  }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const resolvedParams = await searchParams;
  const compounds = await getCompounds();

  const properties = await getProperties({
    area: resolvedParams.area,
    compoundId: resolvedParams.compoundId,
    propertyType: resolvedParams.propertyType,
    maxDownPayment: resolvedParams.maxDownPayment ? Number(resolvedParams.maxDownPayment) : undefined,
    maxTotalPrice: resolvedParams.maxTotalPrice ? Number(resolvedParams.maxTotalPrice) : undefined,
    deliveryStatus: resolvedParams.deliveryStatus,
    query: resolvedParams.query,
    sortBy: resolvedParams.sortBy,
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
            <Link href="/" className="hover:underline">الرئيسية</Link>
            <span>/</span>
            <span className="text-slate-800">وحدات الريسيل المعروضة</span>
            {resolvedParams.area && (
              <>
                <span>/</span>
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {resolvedParams.area}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                سوق عقارات الريسيل في مصر
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                عرض <strong className="text-slate-900 font-bold">{properties.length} وحدة</strong> معتمدة مباشرة من الملاك مع تفاصيل المقدم والأقساط
              </p>
            </div>

            {/* Quick Sort Controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold ml-1 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                ترتيب حسب:
              </span>
              
              <Link
                href={`/properties?${new URLSearchParams({ ...resolvedParams, sortBy: 'down_payment_asc' }).toString()}`}
                className={`px-3.5 py-2 rounded-xl border font-bold transition-all ${
                  resolvedParams.sortBy === 'down_payment_asc'
                    ? 'bg-slate-900 border-slate-900 text-amber-400 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                الأقل مقدم كاش أولاً
              </Link>

              <Link
                href={`/properties?${new URLSearchParams({ ...resolvedParams, sortBy: 'total_price_asc' }).toString()}`}
                className={`px-3.5 py-2 rounded-xl border font-bold transition-all ${
                  resolvedParams.sortBy === 'total_price_asc'
                    ? 'bg-slate-900 border-slate-900 text-amber-400 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                الأقل سعراً إجمالياً
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
              لم نعثر على وحدات تطابق هذه الفلاتر
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              جرب توسيع معايير البحث مثل زيادة الحد الأقصى للمقدم الكاش أو اختيار كل المناطق.
            </p>
            <Link
              href="/properties"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors"
            >
              عرض كافة الوحدات المعروضة
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
