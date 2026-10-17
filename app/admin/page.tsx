'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProperties, getSellerSubmissions, getCompounds } from '@/lib/dataService';
import { formatEGP } from '@/lib/utils';
import { ResaleProperty, SellerSubmission, Compound } from '@/types/database';
import { 
  Building2, 
  Coins, 
  Inbox, 
  CheckCircle2, 
  PlusCircle, 
  MapPin, 
  ArrowLeft, 
  Sparkles,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const [properties, setProperties] = useState<ResaleProperty[]>([]);
  const [submissions, setSubmissions] = useState<SellerSubmission[]>([]);
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, s, c] = await Promise.all([
        getProperties(),
        getSellerSubmissions(),
        getCompounds(),
      ]);
      setProperties(p);
      setSubmissions(s);
      setCompounds(c);
      setLoading(false);
    }
    load();
  }, []);

  const availableCount = properties.filter((p) => p.status === 'available').length;
  const soldCount = properties.filter((p) => p.status === 'sold').length;
  const newSubmissionsCount = submissions.filter((s) => s.status === 'new').length;

  const totalDownPaymentValue = properties.reduce((sum, p) => sum + (p.total_down_payment || 0), 0);
  const totalPortfolioValue = properties.reduce((sum, p) => sum + (p.total_price || 0), 0);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        جاري تحميل بيانات لوحة التحكم...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            مرحباً بك في لوحة تحكم سالينو ريسيل
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            إحصائيات فورية للمبيعات، إدارة الإعلانات، وطلبات الملاك
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-102"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>إضافة وحدة ريسيل جديدة</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Active Listings */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>الوحدات المتاحة</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {availableCount} <span className="text-sm font-normal text-slate-400">وحدة</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>جاهزة للمعاينة والحجز</span>
          </div>
        </div>

        {/* 2. New Seller Submissions */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>طلبات الملاك الجديدة</span>
            <Inbox className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">
            {newSubmissionsCount} <span className="text-sm font-normal text-slate-400">طلب جديد</span>
          </div>
          <div className="text-[11px] text-amber-400/80">
            بحاجة لمراجعة كشف الحساب
          </div>
        </div>

        {/* 3. Total Cash Down Value */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>إجمالي المطلوب كاش بالموقع</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 truncate">
            {formatEGP(totalDownPaymentValue)}
          </div>
          <div className="text-[11px] text-slate-400">
            مقدمات وأوفر برايس الوحدات
          </div>
        </div>

        {/* 4. Total Portfolio Value */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>القيمة الإجمالية للمحفظة</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white truncate">
            {formatEGP(totalPortfolioValue)}
          </div>
          <div className="text-[11px] text-slate-400">
            شامل المتبقي أقساط للمطورين
          </div>
        </div>

      </div>

      {/* Two Column Grid: Submissions & Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Seller Submissions (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">
                أحدث طلبات الملاك لعرض الوحدات
              </h2>
            </div>
            <Link
              href="/admin/submissions"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>عرض الصندوق</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {submissions.slice(0, 4).map((sub) => (
              <div
                key={sub.id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{sub.owner_name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      sub.status === 'new'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : sub.status === 'contacted'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {sub.status === 'new' ? 'جديد' : sub.status === 'contacted' ? 'تم التواصل' : 'معروض'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {sub.property_type} في {sub.compound_name} • {sub.area_sqm} م²
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">
                    المدفوع: {formatEGP(sub.paid_amount)} | الأوفر المطلوب: {formatEGP(sub.over_price)}
                  </div>
                </div>

                <Link
                  href="/admin/submissions"
                  className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                >
                  فحص الطلب
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Properties Quick Management (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-black text-white">
                أحدث الوحدات المدرجة في المنصة
              </h2>
            </div>
            <Link
              href="/admin/properties"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>إدارة العقارات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {properties.slice(0, 4).map((prop) => (
              <div
                key={prop.id}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-amber-400 font-bold">{prop.reference_code}</span>
                      <span className="text-xs font-bold text-white truncate max-w-[200px]">{prop.title_ar}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      كاش الآن: <strong className="text-emerald-400">{formatEGP(prop.total_down_payment)}</strong>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/properties/${prop.id}`}
                  target="_blank"
                  className="shrink-0 text-slate-400 hover:text-white text-xs py-1.5 px-2.5 rounded-lg border border-slate-800 hover:border-slate-700"
                >
                  معاينة
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
