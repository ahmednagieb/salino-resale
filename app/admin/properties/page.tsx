'use client';

import { useState, useEffect, useCallback } from 'react';
import { ResaleProperty, Compound, PropertyStatus } from '@/types/database';
import { 
  getProperties, 
  getCompounds, 
  saveProperty, 
  markAsSoldAndCleanStorage 
} from '@/lib/dataService';
import { generateReferenceCode } from '@/lib/utils';
import ImageUploader from '@/components/admin/ImageUploader';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Sparkles,
  Zap,
  Building,
  Coins
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminPropertiesPage() {
  const { 
    t, 
    lang, 
    formatMoney, 
    translateType, 
    translateFinishing, 
    translateArea 
  } = useLanguage();

  const [properties, setProperties] = useState<ResaleProperty[]>([]);
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Partial<ResaleProperty> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [propsData, compsData] = await Promise.all([
      getProperties(),
      getCompounds(),
    ]);
    setProperties(propsData);
    setCompounds(compsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getProperties(), getCompounds()]).then(([propsData, compsData]) => {
      if (isMounted) {
        setProperties(propsData);
        setCompounds(compsData);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    const newRef = generateReferenceCode(properties.length);
    setEditingProperty({
      reference_code: newRef,
      title_ar: '',
      description_ar: '',
      compound_id: compounds[0]?.id || '',
      property_type: 'شقة',
      area_sqm: 150,
      bedrooms: 3,
      bathrooms: 2,
      floor_number: 2,
      finishing_type: 'نصف تشطيب',
      delivery_status: 'استلام فوري',
      original_price: 6000000,
      paid_amount: 3000000,
      over_price: 500000,
      total_down_payment: 3500000,
      remaining_installments: 3000000,
      total_price: 6500000,
      installment_years_left: 3,
      maintenance_fee: 400000,
      transfer_fee: 100000,
      images: [],
      is_featured: false,
      status: 'available',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prop: ResaleProperty) => {
    setEditingProperty({ ...prop });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    setIsSaving(true);
    try {
      const saved = await saveProperty(editingProperty);
      setActionNotice(
        lang === 'ar'
          ? `تم حفظ الوحدة كود ${saved.reference_code} بنجاح!`
          : `Property ${saved.reference_code} saved successfully!`
      );
      setIsModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  // "Mark as Sold & Clean Storage" Action
  const handleMarkAsSoldAndClean = async (property: ResaleProperty) => {
    if (!window.confirm(t('admin.props.markSoldConfirm'))) return;

    try {
      const updated = await markAsSoldAndCleanStorage(property.id);
      if (updated) {
        setActionNotice(t('admin.props.soldCleanSuccess'));
        await loadData();
      }
    } catch (err: unknown) {
      alert(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Filtered list
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.compound?.name_ar && p.compound.name_ar.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.compound?.name_en && p.compound.name_en.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('admin.props.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('admin.props.subtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>{t('admin.props.addNew')}</span>
        </button>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('admin.props.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl ps-10 pe-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto text-xs">
          {[
            { id: 'all', label: t('admin.props.tabAll') },
            { id: 'available', label: t('admin.props.tabAvailable') },
            { id: 'pending', label: t('admin.props.tabPending') },
            { id: 'sold', label: t('admin.props.tabSold') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Properties Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 text-start">{t('admin.props.colUnit')}</th>
                <th className="py-3.5 px-4 text-start">{t('admin.props.colSpecs')}</th>
                <th className="py-3.5 px-4 text-start">{t('admin.props.colCashNow')}</th>
                <th className="py-3.5 px-4 text-start">{t('admin.props.colRemaining')}</th>
                <th className="py-3.5 px-4 text-start">{t('admin.props.colTotal')}</th>
                <th className="py-3.5 px-4 text-start">{t('admin.props.colStatus')}</th>
                <th className="py-3.5 px-4 text-center">{t('admin.props.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    {t('admin.props.loading')}
                  </td>
                </tr>
              ) : filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    {t('admin.props.noUnits')}
                  </td>
                </tr>
              ) : (
                filteredProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-800/50 transition-colors">
                  
                  {/* Property Info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                        <img
                          src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                            {prop.reference_code}
                          </span>
                          <span className="font-bold text-white max-w-[220px] truncate block">
                            {prop.title_ar}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Building className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>
                            {lang === 'ar' ? (prop.compound?.name_ar || 'كمبوند راقي') : (prop.compound?.name_en || prop.compound?.name_ar || 'Compound')} ({translateArea(prop.compound?.area_name || '')})
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Specs */}
                  <td className="py-4 px-4 text-slate-300">
                    <div>{translateType(prop.property_type)} • {prop.area_sqm} m²</div>
                    <div className="text-[11px] text-slate-400">
                      {prop.bedrooms} {lang === 'ar' ? 'غرف' : 'beds'} • {translateFinishing(prop.finishing_type)}
                    </div>
                  </td>

                  {/* Down Payment */}
                  <td className="py-4 px-4">
                    <span className="text-emerald-400 font-bold block text-sm">
                      {formatMoney(prop.total_down_payment)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {t('admin.props.over')} {formatMoney(prop.over_price)}
                    </span>
                  </td>

                  {/* Remaining */}
                  <td className="py-4 px-4 text-slate-300 font-medium">
                    <div>{formatMoney(prop.remaining_installments)}</div>
                    <div className="text-[10px] text-slate-400">
                      {prop.installment_years_left} {t('admin.props.yearsLeft')}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-4 px-4 font-bold text-white">
                    {formatMoney(prop.total_price)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      prop.status === 'sold'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        : prop.status === 'pending'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {prop.status === 'sold' ? t('admin.props.statusSold') : prop.status === 'pending' ? t('admin.props.statusPending') : t('admin.props.statusAvailable')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      
                      {/* Public Link */}
                      <Link
                        href={`/properties/${prop.id}`}
                        target="_blank"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                        title={t('admin.props.viewUnit')}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg cursor-pointer"
                        title={t('admin.common.edit')}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Mark as Sold & Clean Storage (CRITICAL BUTTON) */}
                      {prop.status !== 'sold' && (
                        <button
                          onClick={() => handleMarkAsSoldAndClean(prop)}
                          className="flex items-center gap-1 bg-rose-950/90 hover:bg-rose-900 text-rose-300 text-[10px] font-bold py-1.5 px-2.5 rounded-lg border border-rose-500/40 transition-colors cursor-pointer"
                          title={t('admin.props.markSoldAndClean')}
                        >
                          <Zap className="w-3 h-3 text-rose-400" />
                          <span className="hidden lg:inline">{t('admin.props.markSoldAndClean')}</span>
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>
                  {editingProperty.id ? t('admin.props.editTitle') : t('admin.props.addTitle')}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Row 1: Code & Compound */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{t('admin.props.refCode')} *</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.reference_code || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, reference_code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-amber-400"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">{t('admin.props.compound')} *</label>
                  <select
                    value={editingProperty.compound_id || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, compound_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    {compounds.map((c) => (
                      <option key={c.id} value={c.id}>
                        {lang === 'ar' ? c.name_ar : (c.name_en || c.name_ar)} - {translateArea(c.area_name)} ({c.developer_name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t('admin.props.titleAr')} *</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: شقة ريسيل بحري فيو لاندسكيب في ميفيدا التجمع الخامس' : 'e.g. 3BR Prime Resale in Mivida New Cairo'}
                  value={editingProperty.title_ar || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, title_ar: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t('admin.props.descAr')}</label>
                <textarea
                  rows={3}
                  value={editingProperty.description_ar || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description_ar: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{t('admin.props.propType')}</label>
                  <select
                    value={editingProperty.property_type || 'شقة'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, property_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="شقة">{translateType('شقة')}</option>
                    <option value="دوبلكس">{translateType('دوبلكس')}</option>
                    <option value="تاون هاوس">{translateType('تاون هاوس')}</option>
                    <option value="توين هاوس">{translateType('توين هاوس')}</option>
                    <option value="فيلا مستقلة">{translateType('فيلا مستقلة')}</option>
                    <option value="بنتهاوس">{translateType('بنتهاوس')}</option>
                    <option value="شاليه">{translateType('شاليه')}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{t('admin.props.areaSqm')}</label>
                  <input
                    type="number"
                    value={editingProperty.area_sqm || 0}
                    onChange={(e) => setEditingProperty({ ...editingProperty, area_sqm: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{t('admin.props.bedrooms')}</label>
                  <input
                    type="number"
                    value={editingProperty.bedrooms || 1}
                    onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{t('admin.props.bathrooms')}</label>
                  <input
                    type="number"
                    value={editingProperty.bathrooms || 1}
                    onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{t('admin.props.finishing')}</label>
                  <select
                    value={editingProperty.finishing_type || 'نصف تشطيب'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, finishing_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="بدون تشطيب">{translateFinishing('بدون تشطيب')}</option>
                    <option value="نصف تشطيب">{translateFinishing('نصف تشطيب')}</option>
                    <option value="تشطيب كامل">{translateFinishing('تشطيب كامل')}</option>
                    <option value="سوبر لوكس">{translateFinishing('سوبر لوكس')}</option>
                    <option value="ألترا سوبر لوكس">{translateFinishing('ألترا سوبر لوكس')}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{t('admin.props.deliveryStatus')}</label>
                  <select
                    value={editingProperty.delivery_status || 'استلام فوري'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, delivery_status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="استلام فوري">{lang === 'ar' ? 'استلام فوري' : 'Ready to Move'}</option>
                    <option value="استلام خلال 6 أشهر">{lang === 'ar' ? 'استلام خلال 6 أشهر' : 'Within 6 Months'}</option>
                    <option value="استلام خلال سنة">{lang === 'ar' ? 'استلام خلال سنة' : 'Within 1 Year'}</option>
                    <option value="استلام 2026">{lang === 'ar' ? 'استلام 2026' : 'Delivery 2026'}</option>
                    <option value="استلام 2027">{lang === 'ar' ? 'استلام 2027' : 'Delivery 2027'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{t('admin.props.floor')}</label>
                  <input
                    type="number"
                    value={editingProperty.floor_number || 1}
                    onChange={(e) => setEditingProperty({ ...editingProperty, floor_number: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{t('admin.props.listingStatus')}</label>
                  <select
                    value={editingProperty.status || 'available'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value as PropertyStatus })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="available">{t('admin.props.statusAvailable')}</option>
                    <option value="pending">{t('admin.props.statusPending')}</option>
                    <option value="sold">{t('admin.props.statusSold')}</option>
                  </select>
                </div>
              </div>

              {/* Financial Inputs */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  <span>{t('admin.props.financialInfo')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">{t('admin.props.paidAmount')} *</label>
                    <input
                      type="number"
                      required
                      value={editingProperty.paid_amount || 0}
                      onChange={(e) => {
                        const paid = Number(e.target.value);
                        const over = Number(editingProperty.over_price || 0);
                        const rem = Number(editingProperty.remaining_installments || 0);
                        setEditingProperty({
                          ...editingProperty,
                          paid_amount: paid,
                          total_down_payment: paid + over,
                          total_price: paid + over + rem,
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-400">{t('admin.props.overPrice')} *</label>
                    <input
                      type="number"
                      required
                      value={editingProperty.over_price || 0}
                      onChange={(e) => {
                        const over = Number(e.target.value);
                        const paid = Number(editingProperty.paid_amount || 0);
                        const rem = Number(editingProperty.remaining_installments || 0);
                        setEditingProperty({
                          ...editingProperty,
                          over_price: over,
                          total_down_payment: paid + over,
                          total_price: paid + over + rem,
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-emerald-400">{t('admin.props.calcDownPayment')}</label>
                    <div className="w-full bg-slate-900/60 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold">
                      {formatMoney((editingProperty.paid_amount || 0) + (editingProperty.over_price || 0))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">{t('admin.props.remainingInst')}</label>
                    <input
                      type="number"
                      value={editingProperty.remaining_installments || 0}
                      onChange={(e) => {
                        const rem = Number(e.target.value);
                        const paid = Number(editingProperty.paid_amount || 0);
                        const over = Number(editingProperty.over_price || 0);
                        setEditingProperty({
                          ...editingProperty,
                          remaining_installments: rem,
                          total_price: paid + over + rem,
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">{t('admin.props.yearsLeftLabel')}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editingProperty.installment_years_left || 0}
                      onChange={(e) => setEditingProperty({ ...editingProperty, installment_years_left: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">{t('admin.props.calcTotal')}</label>
                    <div className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold">
                      {formatMoney((editingProperty.paid_amount || 0) + (editingProperty.over_price || 0) + (editingProperty.remaining_installments || 0))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strict Supabase Free-Tier Image Uploader Component */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  {t('admin.props.mediaSection')}
                </label>
                <ImageUploader
                  referenceCode={editingProperty.reference_code || 'RES-NEW'}
                  existingImages={editingProperty.images || []}
                  onChange={(imgs) => setEditingProperty({ ...editingProperty, images: imgs })}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  {t('admin.common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {isSaving ? t('admin.common.saving') : t('admin.props.savePropertyBtn')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
