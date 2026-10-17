'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Calculator, ArrowLeft, Coins, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function ResaleBudgetCalculator() {
  const [cashDown, setCashDown] = useState<number>(4500000); // 4.5M EGP default
  const [installmentYears, setInstallmentYears] = useState<number>(4); // 4 years default
  const { lang, t, formatMoney } = useLanguage();

  // Estimated annual installment affordable (approx 35% of cash over the period)
  const estimatedRemainingInstallments = Math.round(cashDown * 0.9 * (installmentYears / 3.5));
  const estimatedTotalPrice = cashDown + estimatedRemainingInstallments;
  const estimatedQuarterlyInstallment = installmentYears > 0 
    ? Math.round(estimatedRemainingInstallments / (installmentYears * 4)) 
    : 0;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 end-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 start-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
              <Calculator className="w-3.5 h-3.5" />
              <span>{t('calc.badge')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {t('calc.title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {t('calc.subtitle')}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('calc.marketNote')}</span>
          </div>
        </div>

        {/* Sliders & Visual Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Input (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Slider 1: Cash Down Payment */}
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  {t('calc.cashLabel')}
                </label>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {formatMoney(cashDown)}
                </span>
              </div>

              <input
                type="range"
                min={1500000}
                max={25000000}
                step={250000}
                value={cashDown}
                onChange={(e) => setCashDown(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>{lang === 'en' ? '1.5M EGP' : '1.5 مليون ج.م'}</span>
                <span>{lang === 'en' ? '10M EGP' : '10 مليون ج.م'}</span>
                <span>{lang === 'en' ? '25M EGP' : '25 مليون ج.م'}</span>
              </div>
            </div>

            {/* Slider 2: Installment Years */}
            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  {t('calc.yearsLabel')}
                </label>
                <span className="text-lg font-black text-amber-400">
                  {installmentYears === 0 
                    ? t('calc.cashOnly') 
                    : `${installmentYears} ${t('calc.yearsCount')}`}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={7}
                step={1}
                value={installmentYears}
                onChange={(e) => setInstallmentYears(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>{lang === 'en' ? 'Cash (0)' : 'كاش فوري (0)'}</span>
                <span>{lang === 'en' ? '3 Years' : '3 سنوات'}</span>
                <span>{lang === 'en' ? '5 Years' : '5 سنوات'}</span>
                <span>{lang === 'en' ? '7 Years' : '7 سنوات'}</span>
              </div>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="text-slate-500 font-bold">{t('calc.commonBudgets')}</span>
              <button
                type="button"
                onClick={() => { setCashDown(2500000); setInstallmentYears(5); }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 text-xs cursor-pointer"
              >
                {t('calc.preset1')}
              </button>
              <button
                type="button"
                onClick={() => { setCashDown(5000000); setInstallmentYears(4); }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 text-xs cursor-pointer"
              >
                {t('calc.preset2')}
              </button>
              <button
                type="button"
                onClick={() => { setCashDown(9000000); setInstallmentYears(3); }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 text-xs cursor-pointer"
              >
                {t('calc.preset3')}
              </button>
            </div>

          </div>

          {/* Real-time Calculation Result Card (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {t('calc.resultTitle')}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatMoney(estimatedTotalPrice)}
              </div>
              <p className="text-xs text-slate-400">
                {t('calc.resultSub')}
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t('calc.cashForOwner')}</span>
                <span className="font-black text-emerald-400 font-mono">{formatMoney(cashDown)}</span>
              </div>

              {installmentYears > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('calc.installmentsForDev')}</span>
                    <span className="font-bold text-slate-200">{formatMoney(estimatedRemainingInstallments)}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-amber-300 font-medium">{t('calc.estQuarterly')}</span>
                    <span className="font-bold text-amber-400">{formatMoney(estimatedQuarterlyInstallment)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Direct CTA leading to filtered units */}
            <Link
              href={`/properties?maxDownPayment=${cashDown}`}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-102 active:scale-98"
            >
              <span>{t('calc.viewUnitsCta')} {formatMoney(cashDown)}</span>
              <ArrowLeft className="w-4 h-4 text-slate-950 rtl:rotate-0 ltr:rotate-180 transition-transform" />
            </Link>

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('calc.filterMatchNote')}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
