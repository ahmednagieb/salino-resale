import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPropertyById, getProperties } from '@/lib/dataService';
import { MOCK_PROPERTIES } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return MOCK_PROPERTIES.map((p) => ({ id: p.id }));
}
import ImageGallery from '@/components/ImageGallery';
import FinancialBreakdown from '@/components/FinancialBreakdown';
import PropertyCard from '@/components/PropertyCard';
import { formatEGP, generateWhatsAppLink } from '@/lib/utils';
import { 
  Building, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Paintbrush, 
  Share2, 
  MessageCircle, 
  PhoneCall, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Building2,
  Calendar
} from 'lucide-react';

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const allProps = await getProperties();
  const similarProperties = allProps
    .filter((p) => p.id !== property.id && p.compound?.area_name === property.compound?.area_name)
    .slice(0, 3);

  const whatsappUrl = generateWhatsAppLink(
    property.reference_code,
    property.title_ar,
    property.id
  );

  const isSold = property.status === 'sold';

  return (
    <div className="bg-slate-50 min-h-screen py-8 pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-amber-600 transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-amber-600 transition-colors">وحدات الريسيل</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{property.compound?.name_ar}</span>
            <span>/</span>
            <span className="font-mono text-amber-600 font-bold">{property.reference_code}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-bold">
              كود الوحدة: {property.reference_code}
            </span>
            {isSold ? (
              <span className="bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-lg">
                تم البيع
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                متاحة للشراء الفوري
              </span>
            )}
          </div>
        </div>

        {/* Title & Location Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            {property.title_ar}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="flex items-center gap-1 font-bold text-amber-700">
              <Building className="w-4 h-4 text-amber-500" />
              كمبوند {property.compound?.name_ar}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              {property.compound?.area_name}
            </span>
            <span>•</span>
            <span className="text-slate-500">
              المطور: <strong className="text-slate-800">{property.compound?.developer_name}</strong>
            </span>
          </div>
        </div>

        {/* Main Grid: Gallery & Details on Right, Sticky Sidebar on Left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Image Gallery */}
            <ImageGallery images={property.images} title={property.title_ar} />

            {/* Core Specs Quick Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 border-r-2 border-amber-500 pr-2">
                المواصفات الرئيسية للوحدة
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">المساحة الإجمالية</div>
                    <div className="text-sm font-bold text-slate-900">{property.area_sqm} م²</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">غرف النوم</div>
                    <div className="text-sm font-bold text-slate-900">{property.bedrooms} غرف</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">الحمامات</div>
                    <div className="text-sm font-bold text-slate-900">{property.bathrooms} حمام</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">رقم الدور</div>
                    <div className="text-sm font-bold text-slate-900">
                      {property.floor_number === 1 ? 'أرضي / جاردن' : `الدور ${property.floor_number}`}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Paintbrush className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">حالة التشطيب</div>
                    <div className="text-sm font-bold text-slate-900">{property.finishing_type}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">موعد الاستلام</div>
                    <div className="text-sm font-bold text-slate-900">{property.delivery_status}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3 sm:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">تاريخ الاستلام التعاقدي</div>
                    <div className="text-sm font-bold text-slate-900">
                      {property.delivery_date || 'موضح بعقد المطور'}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Financial Breakdown Box (CRITICAL COMPONENT) */}
            <FinancialBreakdown property={property} />

            {/* Arabic Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-r-2 border-amber-500 pr-2">
                تفاصيل ووصف الوحدة
              </h3>
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description_ar}
              </div>

              {/* Developer & Security Verification Notice */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  الوحدة معروضة ببيانات معتمدة ويتم إتمام التنازل وتغيير الشيكات داخل مقر شركة <strong>{property.compound?.developer_name}</strong> بحضور المشتري والبائع ومستشارنا القانوني.
                </span>
              </div>
            </div>

          </div>

          {/* Sticky Sidebar on Desktop (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-6">
              
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  ملخص تسعير الريسيل
                </span>

                {/* Cash Down Highlight */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80">
                  <div className="text-xs font-bold text-emerald-800">
                    المطلوب كاش الآن (المقدم + الأوفر):
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
                    {formatEGP(property.total_down_payment)}
                  </div>
                </div>

                {/* Remaining & Total */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>المتبقي أقساط للمطور:</span>
                    <span className="font-bold text-slate-900">{formatEGP(property.remaining_installments)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>السعر الإجمالي:</span>
                    <span className="font-black text-slate-900 text-sm">{formatEGP(property.total_price)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-102 active:scale-98"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>تواصل واتساب بخصوص الوحدة</span>
                </a>

                <a
                  href="tel:201000000000"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>اتصال مباشر: 01000000000</span>
                </a>
              </div>

              {/* Safe Resale Notice */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  ضمان أمان صفقات الريسيل:
                </div>
                <p className="leading-relaxed text-[11px]">
                  لا يتم دفع أي مبالغ نقدية أو عربون إلا بعد التأكد من صحة أوراق الملكية ومراجعة كشف حساب المطور الرسمي.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              وحدات ريسيل أخرى في منطقة {property.compound?.area_name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] text-emerald-800 font-bold">المطلوب كاش:</span>
          <span className="text-base font-black text-slate-950">
            {formatEGP(property.total_down_payment)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:201000000000"
            className="p-3 bg-slate-900 text-white rounded-xl active:scale-95 transition-transform"
            aria-label="اتصال هاتفي"
          >
            <PhoneCall className="w-4 h-4 text-amber-400" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>واتساب</span>
          </a>
        </div>
      </div>

    </div>
  );
}
