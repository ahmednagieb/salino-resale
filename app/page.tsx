import Link from 'next/link';
import QuickFilter from '@/components/QuickFilter';
import PropertyCard from '@/components/PropertyCard';
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
  ChevronLeft
} from 'lucide-react';

export default async function HomePage() {
  const compounds = await getCompounds();
  const allProperties = await getProperties();
  const featuredProperties = allProperties.filter((p) => p.is_featured);
  const immediateDeliveryProperties = allProperties.filter((p) => p.delivery_status === 'استلام فوري');

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white pt-16 pb-28 sm:pt-24 sm:pb-36 overflow-hidden">
        
        {/* Background Ambience & Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.18),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Hero Headlines */}
          <div className="text-center max-w-3xl mx-auto space-y-5">
            
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span>المنصة الأولى المتخصصة في الريسيل العقاري بمصر</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              اشتري وحدتك ريسيل بأفضل <span className="text-gold-gradient">أوفر ومقدم كاش</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              تصفح مئات الوحدات الحصرية مباشرة من الملاك في أرقى كمبوندات التجمع الخامس، زايد، ومستقبل سيتي مع كشف حساب وتدقيق شيكات المطور المعتمدة.
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                استلامات فورية وخلال سنة
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                أقساط متساوية بدون فوائد
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                تنازل رسمي في مقر المطور
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
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>أقوى الفرص الاستثمارية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              وحدات ريسيل مميزة ومختارة بعناية
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              وحدات تم فحص موقفها المالي مع المطور وأقل أوفر برايس في السوق
            </p>
          </div>

          <Link
            href="/properties"
            className="flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors group"
          >
            <span>عرض كل الوحدات ({allProperties.length})</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

      </section>

      {/* Immediate Delivery Section (استلام فوري) */}
      {immediateDeliveryProperties.length > 0 && (
        <section className="bg-slate-100/80 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-300/80 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                  جاهز للمعاينة والسكن فوراً
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 pt-1">
                  صفقات ريسيل استلام فوري
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  لا داعي لانتظار سنوات الإنشاء، عاين وحدتك على الطبيعة واستلم مفتاحك فور التنازل
                </p>
              </div>

              <Link
                href="/properties?deliveryStatus=استلام+فوري"
                className="flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                <span>مشاهدة كل الاستلام الفوري</span>
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
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            المواقع الأكثر طلباً
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
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={areaItem.image}
                alt={areaItem.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-3 right-3 left-3 text-white space-y-0.5">
                <span className="font-bold text-sm block group-hover:text-amber-400 transition-colors">
                  {areaItem.name}
                </span>
                <span className="text-[11px] text-slate-300 block">
                  {areaItem.count}+ وحدة معروضة
                </span>
              </div>
            </Link>
          ))}
        </div>

      </section>

      {/* Why Buy Resale? (Market Value Proposition) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 relative overflow-hidden">
          
          <div className="max-w-3xl space-y-3 mb-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              دليل المستثمر والمشتري الذكي
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              لماذا يعتبر شراء «الريسيل» الخيار الأفضل حالياً في مصر؟
            </h2>
            <p className="text-sm text-slate-300">
              ثلاثة أسباب جوهرية تجعل صفقات الريسيل تتفوق على الشراء المباشر للوحدات تحت الإنشاء من الشركات:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                استلام أسرع بسنوات
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                معظم وحدات الريسيل تكون في مراحل إنشائية متقدمة أو استلام فوري، مما يجنبك مخاطر تأخير التسليم وارتفاع تكاليف الإيجار المؤقت.
              </p>
            </div>

            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                توفير كبير في السعر الإجمالي
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                سعر المتر في الريسيل (شاملاً الأوفر) يكون عادة أقل بنسبة 20% إلى 35% من سعر الطرح الجديد للشركة المطورة في نفس المنطقة.
              </p>
            </div>

            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                استكمال أقساط بالجنيه المصري القديم
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تستفيد من عقود تم تحريرها قبل موجات التضخم، حيث تستكمل جدول الأقساط الأصلية للمطور دون إعادة تسعير أو فوائد تعويم.
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
              خاص بملاك الوحدات
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950">
              معاك وحدة في كمبوند وعايز تبيعها كاش بأعلى أوفر؟
            </h2>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              اعرض وحدتك على منصة سالينو ريسيل مجاناً. نقوم بربطك مع مشتريين جادين يبحثون عن صفقات كاش وتسهيل كافة إجراءات التنازل في مقر المطور.
            </p>
          </div>

          <Link
            href="/sell"
            className="shrink-0 bg-slate-950 hover:bg-slate-900 text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <span>اعرض وحدتك للبيع الآن</span>
          </Link>

        </div>
      </section>

    </div>
  );
}
