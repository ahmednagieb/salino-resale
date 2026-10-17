'use client';

import { useState } from 'react';
import { submitSellerUnit } from '@/lib/dataService';
import { formatEGP } from '@/lib/utils';
import { 
  Building2, 
  Coins, 
  CheckCircle2, 
  User, 
  Phone, 
  Home, 
  Maximize2, 
  FileText, 
  Send, 
  Sparkles,
  ShieldCheck,
  Calculator,
  MessageCircle,
  TrendingUp,
  Flame,
  Check,
  HelpCircle,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function SellPropertyPage() {
  const [formData, setFormData] = useState({
    owner_name: '',
    owner_phone: '',
    compound_name: '',
    property_type: 'شقة',
    area_sqm: '',
    paid_amount: '',
    over_price: '',
    remaining_amount: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamic calculations for immediate feedback
  const paid = Number(formData.paid_amount || 0);
  const over = Number(formData.over_price || 0);
  const remaining = Number(formData.remaining_amount || 0);
  const calculatedDownPayment = paid + over;
  const calculatedTotalPrice = calculatedDownPayment + remaining;

  // Market speed index
  const overRatio = paid > 0 ? Math.round((over / paid) * 100) : 0;
  let speedBadge = {
    text: 'أدخل البيانات لعرض مؤشر سرعة البيع',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    desc: 'مؤشر واقعي مبني على سرعة إتمام صفقات الكاش في السوق'
  };

  if (paid > 0 && over > 0) {
    if (overRatio <= 15) {
      speedBadge = {
        text: '🔥 مؤشر سرعة البيع: فائق السرعة (صفقة لقطة)',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        desc: `الأوفر يمثل ${overRatio}% من المدفوع، وهذا الطلب عليه عالي جداً من المشترين الكاش.`
      };
    } else if (overRatio <= 30) {
      speedBadge = {
        text: '⚡ مؤشر سرعة البيع: متوازن ومناسب لمتوسط السوق',
        color: 'bg-amber-50 text-amber-900 border-amber-300',
        desc: `الأوفر يمثل ${overRatio}% من المدفوع، وهو تسعير عادل وطبيعي في التجمع وزايد.`
      };
    } else {
      speedBadge = {
        text: '💎 مؤشر سرعة البيع: استثماري طويل الأجل',
        color: 'bg-blue-50 text-blue-900 border-blue-300',
        desc: `الأوفر يمثل ${overRatio}% من المدفوع، مناسب إذا لم تكن في عجلة للبيع.`
      };
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.owner_name || !formData.owner_phone || !formData.compound_name) {
      setErrorMsg('برجاء ملء البيانات الأساسية (الاسم، رقم الهاتف، اسم الكمبوند)');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitSellerUnit({
        owner_name: formData.owner_name,
        owner_phone: formData.owner_phone,
        compound_name: formData.compound_name,
        property_type: formData.property_type,
        area_sqm: Number(formData.area_sqm || 0),
        paid_amount: paid,
        over_price: over,
        remaining_amount: remaining,
        notes: formData.notes,
      });

      if (res.success) {
        setSubmittedId(res.id || 'REQ-SUCCESS');
      } else {
        setErrorMsg('حدث خطأ أثناء إرسال البيانات. برجاء المحاولة مجدداً.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-700 px-4 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>خدمة مخصصة لملاك الكمبوندات في مصر</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            اعرض وحدتك للبيع ريسيل كاش بأعلى أوفر
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            سجل بيانات وحدتك الآن وسيقوم مستشار الريسيل بالتواصل معك لمراجعة كشف الحساب وعرض الوحدة على شبكة مشتريين جادين.
          </p>
        </div>

        {/* Success Screen */}
        {submittedId ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-2xl text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                تم استلام بيانات وحدتك بنجاح!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                رقم المتابعة الخاص بطلبك: <strong className="font-mono text-emerald-700 font-bold">{submittedId}</strong>. سيتواصل معك أحد مستشارينا خلال ساعتين عمل لمراجعة المستندات وتجهيز إعلان الوحدة.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/201000000000?text=${encodeURIComponent(`السلام عليكم، قمت بتسجيل طلبي لعرض وحدتي ريسيل على المنصة برقم متابعة ${submittedId}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-102 active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>متابعة الطلب عبر واتساب فورا</span>
              </a>

              <Link
                href="/"
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-xl transition-colors"
              >
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        ) : (
          /* Submission Form with Real-time Calculations */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xl space-y-8">
            
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1: Owner Info */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-slate-900 border-r-3 border-amber-500 pr-2.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600" />
                  <span>الخطوة 1: بيانات المالك والتواصل</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">الاسم ثلاثي *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد عبد الله الشريف"
                      value={formData.owner_name}
                      onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">رقم الهاتف (واتساب متاح) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="مثال: 01012345678"
                      value={formData.owner_phone}
                      onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Property Specs */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-base font-black text-slate-900 border-r-3 border-amber-500 pr-2.5 flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-600" />
                  <span>الخطوة 2: مواصفات وبيانات الوحدة</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">اسم الكمبوند والموقع *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: ميفيدا - التجمع الخامس أو بادية - أكتوبر"
                      value={formData.compound_name}
                      onChange={(e) => setFormData({ ...formData, compound_name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">نوع العقار</label>
                    <select
                      value={formData.property_type}
                      onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold cursor-pointer"
                    >
                      <option value="شقة">شقة سكنية</option>
                      <option value="دوبلكس">دوبلكس / آي فيلا</option>
                      <option value="تاون هاوس">تاون هاوس</option>
                      <option value="توين هاوس">توين هاوس</option>
                      <option value="فيلا مستقلة">فيلا مستقلة</option>
                      <option value="بنتهاوس">بنتهاوس بروف</option>
                      <option value="شاليه">شاليه ساحلي</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">المساحة المبنية (م²)</label>
                    <input
                      type="number"
                      placeholder="مثال: 185"
                      value={formData.area_sqm}
                      onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Financials & Over Price Evaluation */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 border-r-3 border-amber-500 pr-2.5 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>الخطوة 3: البيانات المالية والأوفر برايس (ج.م)</span>
                  </h3>
                  <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    حسابات تسعير فورية
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">المدفوع للشركة حتى الآن *</label>
                    <input
                      type="number"
                      required
                      placeholder="مثال: 4500000"
                      value={formData.paid_amount}
                      onChange={(e) => setFormData({ ...formData, paid_amount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                    />
                    <span className="text-[11px] text-slate-400 block">مقدم الحجز + الأقساط المسددة</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-amber-800">الأوفر برايس المطلوب (صافي لك) *</label>
                    <input
                      type="number"
                      required
                      placeholder="مثال: 800000"
                      value={formData.over_price}
                      onChange={(e) => setFormData({ ...formData, over_price: e.target.value })}
                      className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-4 py-3 text-sm text-amber-950 font-mono font-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[11px] text-amber-700 block font-medium">المكسب الصافي المطلوب فوق المدفوع</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">المتبقي أقساط للمطور</label>
                    <input
                      type="number"
                      placeholder="مثال: 3200000"
                      value={formData.remaining_amount}
                      onChange={(e) => setFormData({ ...formData, remaining_amount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                    />
                    <span className="text-[11px] text-slate-400 block">شيكات يستكملها المشتري للمطور</span>
                  </div>
                </div>

                {/* Real-time Market Speed Attractiveness Widget */}
                {paid > 0 && over > 0 && (
                  <div className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${speedBadge.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">{speedBadge.text}</span>
                      <span className="text-xs font-bold font-mono">نسبة الأوفر: {overRatio}%</span>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">
                      {speedBadge.desc}
                    </p>
                  </div>
                )}

                {/* Instant Calculation Live Preview Box */}
                {(paid > 0 || over > 0) && (
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-3 animate-fadeIn">
                    <div className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-emerald-600" />
                      <span>ملخص عرض الوحدة للمشتري على المنصة:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm">
                        <span className="text-slate-500 block font-medium">المطلوب كاش الآن من المشتري:</span>
                        <span className="text-lg font-black text-emerald-700 mt-1 block font-mono">
                          {formatEGP(calculatedDownPayment)}
                        </span>
                        <span className="text-[10px] text-slate-400">المدفوع + الأوفر برايس</span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm">
                        <span className="text-slate-500 block font-medium">السعر الإجمالي النهائي للوحدة:</span>
                        <span className="text-lg font-black text-slate-900 mt-1 block font-mono">
                          {formatEGP(calculatedTotalPrice)}
                        </span>
                        <span className="text-[10px] text-slate-400">شامل شيكات المطور المتبقية</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Notes */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700">ملاحظات إضافية (الدور، الفيو، ميعاد الاستلام)</label>
                <textarea
                  rows={3}
                  placeholder="مثال: الوحدة بحري تطل على لاندسكيب، استلام نهاية 2025، مدفوعة الصيانة بالكامل..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              {/* Trust disclaimer */}
              <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  نلتزم بالسرية التامة لبياناتك الشخصية. لن يتم مشاركة رقم الهاتف إلا بعد التوافق مع مشتري كاش جاد والتنسيق المسبق معك.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-base py-4 rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>جاري إرسال البيانات وتدقيق الحسبة...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-slate-950" />
                    <span>إرسال بيانات الوحدة للعرض الفوري</span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
