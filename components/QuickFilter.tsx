'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compound } from '@/types/database';
import { Search, SlidersHorizontal, MapPin, Building, Home, Coins, Clock, X } from 'lucide-react';

interface QuickFilterProps {
  compounds?: Compound[];
  initialValues?: {
    area?: string;
    compoundId?: string;
    propertyType?: string;
    maxDownPayment?: string;
    maxTotalPrice?: string;
    deliveryStatus?: string;
  };
  onFilterChange?: (filters: any) => void;
  isCompact?: boolean;
}

export default function QuickFilter({
  compounds = [],
  initialValues,
  onFilterChange,
  isCompact = false,
}: QuickFilterProps) {
  const router = useRouter();

  const [area, setArea] = useState(initialValues?.area || '');
  const [compoundId, setCompoundId] = useState(initialValues?.compoundId || '');
  const [propertyType, setPropertyType] = useState(initialValues?.propertyType || '');
  const [maxDownPayment, setMaxDownPayment] = useState(initialValues?.maxDownPayment || '');
  const [maxTotalPrice, setMaxTotalPrice] = useState(initialValues?.maxTotalPrice || '');
  const [deliveryStatus, setDeliveryStatus] = useState(initialValues?.deliveryStatus || '');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Filter compounds based on selected area
  const availableCompounds = area
    ? compounds.filter(c => c.area_name.includes(area))
    : compounds;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams();
    if (area) params.set('area', area);
    if (compoundId) params.set('compoundId', compoundId);
    if (propertyType) params.set('propertyType', propertyType);
    if (maxDownPayment) params.set('maxDownPayment', maxDownPayment);
    if (maxTotalPrice) params.set('maxTotalPrice', maxTotalPrice);
    if (deliveryStatus) params.set('deliveryStatus', deliveryStatus);

    if (onFilterChange) {
      onFilterChange({
        area,
        compoundId,
        propertyType,
        maxDownPayment: maxDownPayment ? Number(maxDownPayment) : undefined,
        maxTotalPrice: maxTotalPrice ? Number(maxTotalPrice) : undefined,
        deliveryStatus,
      });
    } else {
      router.push(`/properties?${params.toString()}`);
    }
  };

  const handleReset = () => {
    setArea('');
    setCompoundId('');
    setPropertyType('');
    setMaxDownPayment('');
    setMaxTotalPrice('');
    setDeliveryStatus('');
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <div className={`w-full ${isCompact ? 'bg-white p-4 rounded-2xl border border-slate-200 shadow-sm' : 'glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/60'}`}>
      
      <form onSubmit={handleSearch} className="space-y-4">
        
        {/* Top Filter Row: Primary Resale Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* 1. Area Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              المنطقة
            </label>
            <select
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setCompoundId(''); // reset compound when area changes
              }}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer shadow-sm"
            >
              <option value="">كل المناطق في مصر</option>
              <option value="التجمع الخامس">التجمع الخامس (القاهرة الجديدة)</option>
              <option value="الشيخ زايد">الشيخ زايد و 6 أكتوبر</option>
              <option value="مستقبل سيتي">مدينة المستقبل (Mostakbal City)</option>
              <option value="العاصمة الإدارية">العاصمة الإدارية الجديدة</option>
              <option value="الساحل الشمالي">الساحل الشمالي</option>
            </select>
          </div>

          {/* 2. Compound Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-500" />
              الكمبوند
            </label>
            <select
              value={compoundId}
              onChange={(e) => setCompoundId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer shadow-sm"
            >
              <option value="">كل الكمبوندات</option>
              {availableCompounds.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_ar} ({c.area_name})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Property Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-amber-500" />
              نوع العقار
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium cursor-pointer shadow-sm"
            >
              <option value="">كل الأنواع</option>
              <option value="شقة">شقة سكنية</option>
              <option value="دوبلكس">دوبلكس / آي فيلا</option>
              <option value="تاون هاوس">تاون هاوس</option>
              <option value="توين هاوس">توين هاوس</option>
              <option value="فيلا مستقلة">فيلا مستقلة (Stand Alone)</option>
              <option value="بنتهاوس">بنتهاوس بروف</option>
              <option value="شاليه">شاليه ساحلي</option>
            </select>
          </div>

          {/* 4. Crucial Resale Filter: Max Cash Down Payment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              الحد الأقصى للمقدم (كاش الآن)
            </label>
            <select
              value={maxDownPayment}
              onChange={(e) => setMaxDownPayment(e.target.value)}
              className="w-full bg-emerald-50/70 border border-emerald-300 rounded-xl px-3.5 py-2.5 text-sm text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
            >
              <option value="">أي مقدم كاش</option>
              <option value="3000000">حتى 3 مليون ج.م</option>
              <option value="5000000">حتى 5 مليون ج.م</option>
              <option value="7500000">حتى 7.5 مليون ج.م</option>
              <option value="10000000">حتى 10 مليون ج.م</option>
              <option value="15000000">حتى 15 مليون ج.م</option>
              <option value="25000000">حتى 25 مليون ج.م</option>
            </select>
          </div>

        </div>

        {/* Advanced Filters Drawer */}
        {isAdvancedOpen && (
          <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            {/* Max Total Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-500" />
                الحد الأقصى للسعر الإجمالي
              </label>
              <select
                value={maxTotalPrice}
                onChange={(e) => setMaxTotalPrice(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="">أي سعر إجمالي</option>
                <option value="8000000">حتى 8 مليون ج.م</option>
                <option value="12000000">حتى 12 مليون ج.م</option>
                <option value="18000000">حتى 18 مليون ج.م</option>
                <option value="25000000">حتى 25 مليون ج.م</option>
                <option value="40000000">حتى 40 مليون ج.م</option>
              </select>
            </div>

            {/* Delivery Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                حالة وتاريخ الاستلام
              </label>
              <select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="">كل حالات الاستلام</option>
                <option value="استلام فوري">استلام فوري (جاهز للسكن)</option>
                <option value="استلام خلال 6 أشهر">استلام خلال 6 أشهر</option>
                <option value="استلام خلال سنة">استلام خلال سنة</option>
                <option value="استلام 2026">استلام خلال 2026</option>
                <option value="استلام 2027">استلام خلال 2027</option>
              </select>
            </div>
          </div>
        )}

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-100"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            {isAdvancedOpen ? 'إخفاء الفلاتر المتقدمة' : 'فلاتر متقدمة (السعر الإجمالي والاستلام)'}
          </button>

          <div className="flex items-center gap-2">
            {(area || compoundId || propertyType || maxDownPayment || maxTotalPrice || deliveryStatus) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-medium text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                إعادة ضبط
              </button>
            )}

            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm px-7 py-3 rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-950" />
              بحث في صفقات الريسيل
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
