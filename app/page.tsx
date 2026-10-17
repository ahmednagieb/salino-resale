import Link from 'next/link';
import QuickFilter from '@/components/QuickFilter';
import PropertyCard from '@/components/PropertyCard';
import ResaleBudgetCalculator from '@/components/ResaleBudgetCalculator';
import { getProperties, getCompounds } from '@/lib/dataService';
import { POPULAR_AREAS } from '@/lib/mockData';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  Clock, 
  ArrowLeft, 
  PlusCircle, 
  CheckCircle2,
  MapPin,
  ChevronLeft,
  BadgePercent,
  FileCheck2,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export default async function HomePage() {
  const compounds = await getCompounds();
  const allProperties = await getProperties();
  const featuredProperties = allProperties.filter((p) => p.is_featured);
  const immediateDeliveryProperties = allProperties.filter((p) => p.delivery_status === 'استلام فوري');

  return (
    <div className="space-y-24 pb-24">
      
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white pt-16 pb-28 sm:pt-24 sm:pb-36 overflow-hidden">
        
        {/* Background Ambience & Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.22),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Hero Headlines */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md animate-pulse-subtle">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>المنصة الأولى المتخصصة في صفقات الريسيل العقاري بمصر</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.18] text-white">
              اشتري وحدتك ريسيل بأفضل <span className="text-gold-gradient">أوفر ومقدم كاش</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              تصفح مئات صفقات الريسيل الحصرية مباشرة من الملاك في أرقى كمبوندات التجمع الخامس، زايد، ومستقبل سيتي مع مراجعة مالية شاملة للمقدم والأقساط.
            </p>

            {/* Quick stats & trust pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>استلامات فورية وخلال سنة</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                <BadgePercent className="w-3.5 h-3.5 text-amber-400" />
                <span>وفر حتى 35% عن أسعار الطرح الجديد</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>تنازل وتغيير شيكات في مقر المطور</span>
              </span>
            </div>

          </div>

          {/* Quick & Advanced Resale Filter Card */}
          <div className="max-w-5xl mx-auto -mb-16 relative z-20">
            <QuickFilter compounds={compounds} />
          </div>

        </div>
      </section>

      {/* Featured Resale Units Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/90 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>أقوى الفرص الاستثمارية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              وحدات ريسيل مختارة بأقل أوفر برايس
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              وحدات تم فحص موقفها المالي مع المطور ومطابقة كافة شيكات وأقساط الشركة
            </p>
          </div>

          <Link
            href="/properties"
            className="flex items-center gap-1.5 text-sm font-black text-slate-900 hover:text-amber-600 transition-colors group"
          >
            <span>عرض كل الوحدات ({allProperties.length})</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

      </section>

      {/* Interactive Resale Budget Calculator Section */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ResaleBudgetCalculator />
      </section>

      {/* Immediate Delivery Section (استلام فوري) */}
      {immediateDeliveryProperties.length > 0 && (
        <section className="bg-slate-100/80 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-300/80 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                  جاهز للمعاينة والسكن فوراً
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 pt-1.5">
                  صفقات ريسيل استلام فوري
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  لا داعي لانتظار سنوات الإنشاء، عاين وحدتك على الطبيعة واستلم مفتاحك فور التنازل
                </p>
              </div>

              <Link
                href="/properties?deliveryStatus=استلام+فوري"
                className="flex items-center gap-1.5 text-sm font-black text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                <span>مشاهدة كل الاستلام الفوري ({immediateDeliveryProperties.length})</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {immediateDeliveryProperties.slice(0, 3).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Browse By Area Section */}
      <section id="areas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
            المواقع الأكثر طلباً في مصر
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            تصفح عقارات الريسيل حسب المنطقة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            اختر المنطقة لعرض جميع الكمبوندات والوحدات المتاحة فيها
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_AREAS.map((areaItem) => (
            <Link
              key={areaItem.name}
              href={`/properties?area=${encodeURIComponent(areaItem.name)}`}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/60"
            >
              <img
                src={areaItem.image}
                alt={areaItem.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-3.5 right-3.5 left-3.5 text-white space-y-0.5">
                <span className="font-black text-sm block group-hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>{areaItem.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="text-[11px] text-slate-300 block font-medium">
                  {areaItem.count}+ وحدة معروضة
                </span>
              </div>
            </Link>
          ))}
        </div>

      </section>

      {/* Comparison: Why Buy Resale vs Direct Developer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 relative overflow-hidden">
          
          <div className="max-w-3xl space-y-3 mb-10">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
              مقارنة ذكية للمشتري والمستثمر
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              لماذا يتفوق شراء «الريسيل» على الطرح الجديد للشركات؟
            </h2>
            <p className="text-sm text-slate-300">
              ثلاثة أسباب جوهرية تجعل صفقات الريسيل الخيار الأكثر أماناً وتوفيراً في السوق العقاري المصري:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">
                استلام أسرع بـ 3 إلى 5 سنوات
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                معظم وحدات الريسيل تكون في مراحل إنشائية متقدمة أو استلام فوري، مما يجنبك مخاطر تأخير التسليم وارتفاع تكاليف الإيجار المؤقت.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">
                توفير من 20% إلى 35% في السعر
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                سعر المتر في الريسيل (شاملاً الأوفر) يكون عادة أقل بشكل ملحوظ من سعر المتر للطرح الجديد للمطور في نفس المنطقة ونفس الكواليتي.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-3 hover:border-sky-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">
                أقساط بالجنيه المصري القديم
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                تستفيد من عقود تم تحريرها قبل موجات التضخم، حيث تستكمل جدول الأقساط الأصلية للمطور دون أي إعادة تسعير أو فوائد تعويم.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Owner CTA Banner: Sell Your Property */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 text-center md:text-right max-w-2xl">
            <span className="bg-slate-950 text-white font-bold text-xs px-3 py-1 rounded-full inline-block">
              خاص بملاك الكمبوندات
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
              معاك وحدة في كمبوند وعايز تبيعها كاش بأعلى أوفر؟
            </h2>
            <p className="text-sm font-bold text-slate-900 leading-relaxed">
              اعرض وحدتك على منصة سالينو ريسيل مجاناً. نقوم بتدقيق الحسبة المالية ومطابقة كشف حساب المطور، وتوصيلك بمشتريين كاش جادين مع تسهيل كافة إجراءات التنازل.
            </p>
          </div>

          <Link
            href="/sell"
            className="shrink-0 bg-slate-950 hover:bg-slate-900 text-white font-black text-base px-8 py-4 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <span>اعرض وحدتك للبيع الآن</span>
          </Link>

        </div>
      </section>

    </div>
  );
}
