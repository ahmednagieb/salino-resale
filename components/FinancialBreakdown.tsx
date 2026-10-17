'use client';

import { useState } from 'react';
import { ResaleProperty } from '@/types/database';
import { formatEGP } from '@/lib/utils';
import { 
  Calculator, 
  Coins, 
  Calendar, 
  AlertCircle,
  FileCheck2,
  CheckCircle,
  Receipt,
  Copy,
  Check,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';

interface FinancialBreakdownProps {
  property: ResaleProperty;
}

export default function FinancialBreakdown({ property }: FinancialBreakdownProps) {
  const [copied, setCopied] = useState(false);

  const total = property.total_price || (property.total_down_payment + property.remaining_installments) || 1;
  const paidPercent = Math.round((property.paid_amount / total) * 100);
  const overPercent = Math.round((property.over_price / total) * 100);
  const remainingPercent = 100 - paidPercent - overPercent;

  // Estimated quarterly installment
  const quarterlyInstallment = property.installment_years_left > 0
    ? Math.round(property.remaining_installments / (property.installment_years_left * 4))
    : 0;

  const handleCopySummary = () => {
    const text = `ملخص الحسبة المالية لوحدة ريسيل (${property.reference_code}) في ${property.compound?.name_ar}:
- المطلوب كاش الآن (مقدم + أوفر): ${formatEGP(property.total_down_payment)}
- المتبقي أقساط للمطور: ${formatEGP(property.remaining_installments)} على ${property.installment_years_left} سنوات
- السعر الإجمالي: ${formatEGP(property.total_price)}
- وديعة الصيانة: ${formatEGP(property.maintenance_fee)}
- رسوم التنازل: ${formatEGP(property.transfer_fee)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xl space-y-6 p-6 sm:p-8">
      
      {/* Header with Title & Copy Summary Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-sm">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              تفاصيل السداد والبيانات المالية للريسيل
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              حسابات دقيقة ومفصلة للمطلوب كاش، الأوفر برايس، ومتبقي شيكات المطور
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">تم نسخ الحسبة!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>نسخ ملخص الحسبة</span>
              </>
            )}
          </button>

          <span className="bg-slate-900 text-amber-400 font-mono text-xs font-bold px-3 py-2 rounded-xl shadow-sm">
            {property.reference_code}
          </span>
        </div>
      </div>

      {/* Visual Multi-Segment Equity Bar */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            توزيع القيمة المالية للوحدة:
          </span>
          <span className="text-slate-500 font-normal">إجمالي السعر: {formatEGP(property.total_price)}</span>
        </div>

        {/* Stacked Bar */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
          <div 
            style={{ width: `${paidPercent}%` }} 
            className="h-full bg-emerald-600 transition-all duration-500" 
            title={`المدفوع للشركة: ${paidPercent}%`}
          />
          <div 
            style={{ width: `${overPercent}%` }} 
            className="h-full bg-amber-500 transition-all duration-500" 
            title={`الأوفر برايس: ${overPercent}%`}
          />
          <div 
            style={{ width: `${remainingPercent}%` }} 
            className="h-full bg-sky-500 transition-all duration-500" 
            title={`المتبقي أقساط: ${remainingPercent}%`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
            <span className="text-slate-600 font-medium">المدفوع للشركة: <strong>{formatEGP(property.paid_amount)} ({paidPercent}%)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-600 font-medium">الأوفر برايس: <strong>{formatEGP(property.over_price)} ({overPercent}%)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
            <span className="text-slate-600 font-medium">متبقي أقساط: <strong>{formatEGP(property.remaining_installments)} ({remainingPercent}%)</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Financial Highlight: Cash Now vs Installments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Total Cash Now */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl p-5 shadow-lg shadow-emerald-700/20 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                المطلوب سداده كاش الآن للمالك
              </span>
              <Coins className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="text-3xl font-black tracking-tight mt-2 font-mono">
              {formatEGP(property.total_down_payment)}
            </div>
            <p className="text-xs text-emerald-100/90 mt-1">
              عبارة عن: المدفوع للشركة ({formatEGP(property.paid_amount)}) + الأوفر برايس ({formatEGP(property.over_price)})
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/40 text-[11px] text-emerald-100 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
            <span>يتم تسليمه للمالك وقت توقيع التنازل في مقر المطور</span>
          </div>
        </div>

        {/* Total Remaining Installments */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                المتبقي أقساط مستحقة للمطور
              </span>
              <Receipt className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black tracking-tight text-white mt-2 font-mono">
              {formatEGP(property.remaining_installments)}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              أقساط متساوية ومباشرة للمطور بدون أي فوائد إضافية
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>
                متبقي {property.installment_years_left} سنوات قسط
              </span>
            </div>
            {quarterlyInstallment > 0 && (
              <span className="text-amber-400 font-bold font-mono">
                ~ {formatEGP(quarterlyInstallment)} / ربع سنوي
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Structured Detailed Breakdown Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-black text-slate-800">
            جدول تفصيل بنود الشراء والمدفوعات
          </span>
          <span className="text-[11px] text-slate-500">القيم بالجنيه المصري</span>
        </div>

        <div className="divide-y divide-slate-100 text-sm">
          
          <div className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50">
            <span className="text-slate-600 font-medium">سعر الوحدة الأصلي في عقد المطور:</span>
            <span className="font-bold text-slate-800 font-mono">{formatEGP(property.original_price)}</span>
          </div>

          <div className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50">
            <div className="flex flex-col">
              <span className="text-slate-700 font-semibold">المدفوع من المالك الأصلي للشركة:</span>
              <span className="text-[11px] text-slate-400">مقدم التعاقد + الأقساط المسددة حتى اليوم</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">{formatEGP(property.paid_amount)}</span>
          </div>

          <div className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 bg-amber-50/30">
            <div className="flex flex-col">
              <span className="text-amber-900 font-bold">الأوفر برايس المطلوب (Over Price):</span>
              <span className="text-[11px] text-amber-700">مكسب المالك الأصلي فوق ما تم سداده</span>
            </div>
            <span className="font-black text-amber-900 font-mono">{formatEGP(property.over_price)}</span>
          </div>

          <div className="flex items-center justify-between px-5 py-3.5 bg-emerald-50/60 font-bold border-y border-emerald-100">
            <span className="text-emerald-950 font-black text-base">إجمالي المطلوب كاش للمالك (المقدم + الأوفر):</span>
            <span className="text-emerald-700 font-black text-lg font-mono">{formatEGP(property.total_down_payment)}</span>
          </div>

          <div className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50">
            <div className="flex flex-col">
              <span className="text-slate-700 font-semibold">إجمالي الأقساط المتبقية للمطور:</span>
              <span className="text-[11px] text-slate-400">تدفع على أقساط ربع سنوية أو سنوية</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">{formatEGP(property.remaining_installments)}</span>
          </div>

          <div className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50">
            <span className="text-slate-600 font-medium">عدد سنوات القسط المتبقية:</span>
            <span className="font-bold text-slate-800">{property.installment_years_left} سنوات</span>
          </div>

          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 text-white font-bold">
            <span className="text-white font-black text-base">السعر الإجمالي النهائي للوحدة:</span>
            <span className="text-amber-400 font-black text-lg font-mono">{formatEGP(property.total_price)}</span>
          </div>

        </div>
      </div>

      {/* Auxiliary Costs: Maintenance & Transfer Fee */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-3">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase">
          <FileCheck2 className="w-4 h-4 text-amber-600" />
          مصاريف إضافية مرتبطة بالريسيل وإجراءات التنازل
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">وديعة الصيانة (Maintenance Fee):</div>
            <div className="text-lg font-black text-slate-900 mt-1 font-mono">
              {formatEGP(property.maintenance_fee)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              تسدد عادة عند الاستلام حسب لائحة المطور
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">رسوم التنازل بالشركة (Transfer Fee):</div>
            <div className="text-lg font-black text-slate-900 mt-1 font-mono">
              {formatEGP(property.transfer_fee)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              رسوم تغيير الملكية المعتمدة رسمياً في مقر المطور
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            يتم فحص الموقف المالي للوحدة واستخراج شهادة خلو طرف (المخالصة) رسمياً من إدارة حسابات المطور قبل توقيع عقود التنازل لضمان حقوق المشتري كاملة.
          </span>
        </div>
      </div>

    </div>
  );
}
