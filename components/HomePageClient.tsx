'use client';

import Link from 'next/link';
import QuickFilter from '@/components/QuickFilter';
import PropertyCard from '@/components/PropertyCard';
import ResaleBudgetCalculator from '@/components/ResaleBudgetCalculator';
import { useLanguage } from '@/context/LanguageContext';
import { Compound, ResaleProperty } from '@/types/database';
import { POPULAR_AREAS } from '@/lib/mockData';
import { 
  Sparkles, 
  ArrowLeft, 
  PlusCircle, 
  CheckCircle2,
  BadgePercent,
  Lock,
  ArrowUpRight
} from 'lucide-react';

interface HomePageClientProps {
  compounds: Compound[];
  allProperties: ResaleProperty[];
  featuredProperties: ResaleProperty[];
  immediateDeliveryProperties: ResaleProperty[];
}

export default function HomePageClient({
  compounds,
  allProperties,
  featuredProperties,
  immediateDeliveryProperties,
}: HomePageClientProps) {
  const { lang, t, translateArea } = useLanguage();

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
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.18] text-white">
              {t('hero.titlePart1')} <span className="text-gold-gradient">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              {t('hero.description')}
            </p>

            {/* Quick stats & trust pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('hero.pillImmediate')}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                <BadgePercent className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('hero.pillDiscount')}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('hero.pillContract')}</span>
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
              <span>{t('sec.featuredBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t('sec.featuredTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('sec.featuredSub')}
            </p>
          </div>

          <Link
            href="/properties"
            className="flex items-center gap-1.5 text-sm font-black text-slate-900 hover:text-amber-600 transition-colors group"
          >
            <span>{t('sec.viewAll')} ({allProperties.length})</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 transition-transform" />
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

      {/* Immediate Delivery Resale Units */}
      {immediateDeliveryProperties.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/90 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t('sec.immediateBadge')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t('sec.immediateTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {t('sec.immediateSub')}
              </p>
            </div>

            <Link
              href="/properties?deliveryStatus=استلام+فوري"
              className="flex items-center gap-1.5 text-sm font-black text-slate-900 hover:text-emerald-700 transition-colors group"
            >
              <span>{t('sec.viewAll')} ({immediateDeliveryProperties.length})</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {immediateDeliveryProperties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}

      {/* Comparison: Resale vs Primary Launch */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black">
              {t('comp.title')}
            </h2>
            <p className="text-sm text-slate-400">
              {t('comp.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Resale Advantage */}
            <div className="bg-slate-950/80 rounded-2xl p-6 sm:p-8 border border-emerald-500/40 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-emerald-400">
                  {t('comp.resaleTitle')}
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  {t('comp.resaleBadge')}
                </span>
              </div>

              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('comp.resaleP1')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('comp.resaleP2')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('comp.resaleP3')}</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Primary Drawbacks */}
            <div className="bg-slate-950/80 rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-slate-300">
                  {t('comp.primaryTitle')}
                </span>
                <span className="text-xs bg-slate-800 text-slate-400 font-bold px-3 py-1 rounded-full border border-slate-700">
                  {t('comp.primaryBadge')}
                </span>
              </div>

              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                  <span>{t('comp.primaryP1')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                  <span>{t('comp.primaryP2')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                  <span>{t('comp.primaryP3')}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Explore by Prime Egyptian Areas */}
      <section id="areas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t('areas.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('areas.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_AREAS.map((area) => (
            <Link
              key={area.name}
              href={`/properties?area=${encodeURIComponent(area.name)}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg border border-slate-200/80 hover:shadow-2xl transition-all"
            >
              <img
                src={area.image}
                alt={area.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-5 start-5 end-5 space-y-1">
                <span className="text-xs font-bold text-amber-400">
                  {area.count} {lang === 'en' ? 'Resale Units' : 'وحدة ريسيل'}
                </span>
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  {translateArea(area.name)}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  {lang === 'en' ? area.description_en : area.description}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-white group-hover:text-amber-400">
                  <span>{t('areas.viewUnits')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90 ltr:rotate-0 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Seller CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-8 sm:p-14 text-slate-950 shadow-2xl">
          <div className="max-w-2xl space-y-5">
            <span className="inline-block bg-slate-950 text-amber-400 text-xs font-black px-3.5 py-1.5 rounded-full shadow-sm">
              {t('sellBanner.badge')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight text-slate-950">
              {t('sellBanner.title')}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-slate-900/90 leading-relaxed">
              {t('sellBanner.subtitle')}
            </p>
            <div className="pt-2">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-black text-sm px-6 py-3.5 rounded-xl shadow-xl hover:scale-102 active:scale-98 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>{t('sellBanner.cta')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
