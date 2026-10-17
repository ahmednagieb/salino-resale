'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compound, ResaleFilterParams } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Building, 
  Coins, 
  Clock, 
  X
} from 'lucide-react';

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
  onFilterChange?: (filters: ResaleFilterParams) => void;
  isCompact?: boolean;
}

const PROPERTY_TYPES = ['الكل', 'شقة', 'دوبلكس', 'تاون هاوس', 'فيلا مستقلة', 'بنتهاوس', 'شاليه'];

export default function QuickFilter({
  compounds = [],
  initialValues,
  onFilterChange,
  isCompact = false,
}: QuickFilterProps) {
  const router = useRouter();
  const { lang, t, translateType, translateDelivery, translateArea } = useLanguage();

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
    if (propertyType && propertyType !== 'الكل') params.set('propertyType', propertyType);
    if (maxDownPayment) params.set('maxDownPayment', maxDownPayment);
    if (maxTotalPrice) params.set('maxTotalPrice', maxTotalPrice);
    if (deliveryStatus) params.set('deliveryStatus', deliveryStatus);

    if (onFilterChange) {
      onFilterChange({
        area,
        compoundId,
        propertyType: propertyType !== 'الكل' ? propertyType : undefined,
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

  const activeFilterCount = [
    area,
    compoundId,
    propertyType && propertyType !== 'الكل',
    maxDownPayment,
    maxTotalPrice,
    deliveryStatus
  ].filter(Boolean).length;

  const cashPresets = [
    { label: lang === 'en' ? 'Up to 3M' : 'حتى 3 مليون', value: '3000000' },
    { label: lang === 'en' ? 'Up to 5M' : 'حتى 5 مليون', value: '5000000' },
    { label: lang === 'en' ? 'Up to 8M' : 'حتى 8 مليون', value: '8000000' },
    { label: lang === 'en' ? 'Up to 12M' : 'حتى 12 مليون', value: '12000000' },
  ];

  return (
    <div className={`w-full ${
      isCompact 
        ? 'bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm' 
        : 'glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/70'
    }`}>
      
      <form onSubmit={handleSearch} className="space-y-5">
        
        {/* Top: Property Type Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 shrink-0 me-1">
            {t('filter.propertyType')}
          </span>
          {PROPERTY_TYPES.map((type) => {
            const isSelected = (type === 'الكل' && !propertyType) || propertyType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setPropertyType(type === 'الكل' ? '' : type)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {translateType(type)}
              </button>
            );
          })}
        </div>

        {/* Primary Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* 1. Area Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('filter.areaLabel')}</span>
            </label>
            <div className="relative">
              <select
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setCompoundId('');
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-850 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm appearance-none"
              >
                <option value="">{t('filter.allAreas')}</option>
                <option value="التجمع الخامس">{translateArea('التجمع الخامس')}</option>
                <option value="الشيخ زايد">{translateArea('الشيخ زايد')}</option>
                <option value="مستقبل سيتي">{translateArea('مستقبل سيتي')}</option>
                <option value="العاصمة الإدارية">{translateArea('العاصمة الإدارية')}</option>
                <option value="الساحل الشمالي">{translateArea('الساحل الشمالي')}</option>
              </select>
            </div>
          </div>

          {/* 2. Compound Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('filter.compoundLabel')}</span>
            </label>
            <div className="relative">
              <select
                value={compoundId}
                onChange={(e) => setCompoundId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-850 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm appearance-none"
              >
                <option value="">{t('filter.allCompounds')}</option>
                {availableCompounds.map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === 'en' && c.name_en ? c.name_en : c.name_ar} ({translateArea(c.area_name)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Crucial Resale Filter: Max Cash Down Payment */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('filter.maxDownPayment')}</span>
            </label>
            <select
              value={maxDownPayment}
              onChange={(e) => setMaxDownPayment(e.target.value)}
              className="w-full bg-emerald-50/80 border border-emerald-300 rounded-xl px-3.5 py-2.5 text-sm text-emerald-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
            >
              <option value="">{t('filter.anyCash')}</option>
              <option value="3000000">{lang === 'en' ? 'Up to 3 Million EGP' : 'حتى 3 مليون ج.م'}</option>
              <option value="5000000">{lang === 'en' ? 'Up to 5 Million EGP' : 'حتى 5 مليون ج.م'}</option>
              <option value="7500000">{lang === 'en' ? 'Up to 7.5 Million EGP' : 'حتى 7.5 مليون ج.م'}</option>
              <option value="10000000">{lang === 'en' ? 'Up to 10 Million EGP' : 'حتى 10 مليون ج.م'}</option>
              <option value="15000000">{lang === 'en' ? 'Up to 15 Million EGP' : 'حتى 15 مليون ج.م'}</option>
              <option value="25000000">{lang === 'en' ? 'Up to 25 Million EGP' : 'حتى 25 مليون ج.م'}</option>
            </select>
          </div>

          {/* 4. Delivery Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('filter.deliveryLabel')}</span>
            </label>
            <select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-850 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm"
            >
              <option value="">{t('filter.allDelivery')}</option>
              <option value="استلام فوري">{translateDelivery('استلام فوري')}</option>
              <option value="استلام خلال 6 أشهر">{translateDelivery('استلام خلال 6 أشهر')}</option>
              <option value="استلام خلال سنة">{translateDelivery('استلام خلال سنة')}</option>
              <option value="استلام 2026">{translateDelivery('استلام 2026')}</option>
              <option value="استلام 2027">{translateDelivery('استلام 2027')}</option>
            </select>
          </div>

        </div>

        {/* Quick Budget Presets row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-bold text-[11px]">
            {t('filter.quickPresets')}
          </span>
          {cashPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setMaxDownPayment(preset.value)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                maxDownPayment === preset.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/70'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters Drawer */}
        {isAdvancedOpen && (
          <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('filter.maxTotalPrice')}</span>
              </label>
              <select
                value={maxTotalPrice}
                onChange={(e) => setMaxTotalPrice(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="">{t('filter.anyTotalPrice')}</option>
                <option value="8000000">{lang === 'en' ? 'Up to 8 Million EGP' : 'حتى 8 مليون ج.م'}</option>
                <option value="12000000">{lang === 'en' ? 'Up to 12 Million EGP' : 'حتى 12 مليون ج.م'}</option>
                <option value="18000000">{lang === 'en' ? 'Up to 18 Million EGP' : 'حتى 18 مليون ج.م'}</option>
                <option value="25000000">{lang === 'en' ? 'Up to 25 Million EGP' : 'حتى 25 مليون ج.م'}</option>
                <option value="40000000">{lang === 'en' ? 'Up to 40 Million EGP' : 'حتى 40 مليون ج.م'}</option>
              </select>
            </div>
          </div>
        )}

        {/* Action Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors py-1.5 px-2 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            <span>{isAdvancedOpen ? t('filter.hideAdvanced') : t('filter.advancedFilters')}</span>
          </button>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('filter.reset')} ({activeFilterCount})</span>
              </button>
            )}

            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm px-7 py-3 rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>{t('filter.searchCta')}</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
