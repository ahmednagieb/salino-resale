'use client';

import { useState, useEffect } from 'react';
import { ResaleProperty, Compound } from '@/types/database';
import { 
  getProperties, 
  getCompounds, 
  saveProperty, 
  markAsSoldAndCleanStorage 
} from '@/lib/dataService';
import { formatEGP, generateReferenceCode } from '@/lib/utils';
import ImageUploader from '@/components/admin/ImageUploader';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit, 
  ExternalLink, 
  CheckCircle, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Sparkles,
  Zap,
  Building,
  Coins,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPropertiesPage() {
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [propsData, compsData] = await Promise.all([
      getProperties(),
      getCompounds(),
    ]);
    setProperties(propsData);
    setCompounds(compsData);
    setLoading(false);
  };

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
      setActionNotice(`تم حفظ الوحدة كود ${saved.reference_code} بنجاح!`);
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(`خطأ أثناء الحفظ: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // "Mark as Sold & Clean Storage" Action (Required Critical Feature)
  const handleMarkAsSoldAndClean = async (property: ResaleProperty) => {
    const confirmText = `هل أنت متأكد من تمييز الوحدة (${property.reference_code}) كـ "تم البيع"؟
سيتم تلقائياً حذف كافة الصور الإضافية من Supabase Storage للحفاظ على باقة Free-Tier مع الاحتفاظ بالصورة الرئيسية فقط.`;

    if (!window.confirm(confirmText)) return;

    try {
      const updated = await markAsSoldAndCleanStorage(property.id);
      if (updated) {
        setActionNotice(`تم بيع الوحدة ${property.reference_code} وتنظيف الصور الإضافية من السحابة بنجاح! تم توفير مساحة التخزين.`);
        await loadData();
      }
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
  };

  // Filtered list
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.compound?.name_ar.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            إدارة وحدات وعقارات الريسيل
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            إضافة وتعديل عروض الملاك، رفع الصور المحسنة (WebP)، وتفريغ مساحات التخزين
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>إضافة وحدة ريسيل جديدة</span>
        </button>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث بالكود (RES-101) أو الاسم أو الكمبوند..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'available', label: 'متاح للبيع' },
            { id: 'sold', label: 'تم البيع' },
            { id: 'pending', label: 'حجز مبدئي' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
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
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">الوحدة والكمبوند</th>
                <th className="py-3.5 px-4">المواصفات</th>
                <th className="py-3.5 px-4">المطلوب كاش الآن</th>
                <th className="py-3.5 px-4">المتبقي أقساط</th>
                <th className="py-3.5 px-4">السعر الإجمالي</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredProperties.map((prop) => (
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
                          <Building className="w-3 h-3 text-amber-500" />
                          <span>{prop.compound?.name_ar || 'كمبوند راقي'} ({prop.compound?.area_name})</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Specs */}
                  <td className="py-4 px-4 text-slate-300">
                    <div>{prop.property_type} • {prop.area_sqm} م²</div>
                    <div className="text-[11px] text-slate-400">{prop.bedrooms} غرف • {prop.finishing_type}</div>
                  </td>

                  {/* Down Payment */}
                  <td className="py-4 px-4">
                    <span className="text-emerald-400 font-bold block text-sm">
                      {formatEGP(prop.total_down_payment)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      أوفر: {formatEGP(prop.over_price)}
                    </span>
                  </td>

                  {/* Remaining */}
                  <td className="py-4 px-4 text-slate-300 font-medium">
                    <div>{formatEGP(prop.remaining_installments)}</div>
                    <div className="text-[10px] text-slate-400">على {prop.installment_years_left} سنوات</div>
                  </td>

                  {/* Total */}
                  <td className="py-4 px-4 font-bold text-white">
                    {formatEGP(prop.total_price)}
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
                      {prop.status === 'sold' ? 'تم البيع' : prop.status === 'pending' ? 'حجز مبدئي' : 'متاح للبيع'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      
                      {/* Public Link */}
                      <Link
                        href={`/properties/${prop.id}`}
                        target="_blank"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                        title="معاينة في الموقع"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg"
                        title="تعديل بيانات الوحدة"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Mark as Sold & Clean Storage (CRITICAL BUTTON) */}
                      {prop.status !== 'sold' && (
                        <button
                          onClick={() => handleMarkAsSoldAndClean(prop)}
                          className="flex items-center gap-1 bg-rose-950/90 hover:bg-rose-900 text-rose-300 text-[10px] font-bold py-1.5 px-2.5 rounded-lg border border-rose-500/40 transition-colors"
                          title="تم البيع وحذف الصور الإضافية لتوفير المساحة"
                        >
                          <Zap className="w-3 h-3 text-rose-400" />
                          <span>بيع وتنظيف التخزين</span>
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              ))}
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
                  {editingProperty.id ? 'تعديل بيانات وحدة ريسيل' : 'إضافة وحدة ريسيل جديدة'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Row 1: Code & Compound */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">كود الوحدة (Reference Code) *</label>
                  <input
                    type="text"
                    required
                    value={editingProperty.reference_code || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, reference_code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-amber-400"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">الكمبوند *</label>
                  <select
                    value={editingProperty.compound_id || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, compound_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    {compounds.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_ar} - {c.area_name} ({c.developer_name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">عنوان الإعلان *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شقة ريسيل بحري فيو لاندسكيب في ميفيدا التجمع الخامس"
                  value={editingProperty.title_ar || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, title_ar: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">الوصف والتفاصيل</label>
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
                  <label className="text-xs font-bold text-slate-300">نوع العقار</label>
                  <select
                    value={editingProperty.property_type || 'شقة'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, property_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="شقة">شقة</option>
                    <option value="دوبلكس">دوبلكس</option>
                    <option value="تاون هاوس">تاون هاوس</option>
                    <option value="توين هاوس">توين هاوس</option>
                    <option value="فيلا مستقلة">فيلا مستقلة</option>
                    <option value="بنتهاوس">بنتهاوس</option>
                    <option value="شاليه">شاليه</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">المساحة (م²)</label>
                  <input
                    type="number"
                    value={editingProperty.area_sqm || 0}
                    onChange={(e) => setEditingProperty({ ...editingProperty, area_sqm: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">غرف النوم</label>
                  <input
                    type="number"
                    value={editingProperty.bedrooms || 1}
                    onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">الحمامات</label>
                  <input
                    type="number"
                    value={editingProperty.bathrooms || 1}
                    onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">التشطيب</label>
                  <select
                    value={editingProperty.finishing_type || 'نصف تشطيب'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, finishing_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="بدون تشطيب">بدون تشطيب</option>
                    <option value="نصف تشطيب">نصف تشطيب</option>
                    <option value="تشطيب كامل">تشطيب كامل</option>
                    <option value="سوبر لوكس">سوبر لوكس</option>
                    <option value="ألترا سوبر لوكس">ألترا سوبر لوكس</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">حالة الاستلام</label>
                  <select
                    value={editingProperty.delivery_status || 'استلام فوري'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, delivery_status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="استلام فوري">استلام فوري</option>
                    <option value="استلام خلال 6 أشهر">استلام خلال 6 أشهر</option>
                    <option value="استلام خلال سنة">استلام خلال سنة</option>
                    <option value="استلام 2026">استلام 2026</option>
                    <option value="استلام 2027">استلام 2027</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">الدور</label>
                  <input
                    type="number"
                    value={editingProperty.floor_number || 1}
                    onChange={(e) => setEditingProperty({ ...editingProperty, floor_number: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">حالة العرض</label>
                  <select
                    value={editingProperty.status || 'available'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="available">متاح للبيع</option>
                    <option value="pending">حجز مبدئي</option>
                    <option value="sold">تم البيع</option>
                  </select>
                </div>
              </div>

              {/* Financial Inputs (Crucial for Resale) */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  <span>البيانات المالية للريسيل (تحديث تلقائي للمقدم والإجمالي)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">المدفوع للشركة *</label>
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
                    <label className="text-[11px] font-bold text-amber-400">الأوفر برايس المطلوب *</label>
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
                    <label className="text-[11px] font-bold text-emerald-400">إجمالي المطلوب كاش (محسوب)</label>
                    <div className="w-full bg-slate-900/60 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold">
                      {formatEGP((editingProperty.paid_amount || 0) + (editingProperty.over_price || 0))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">المتبقي أقساط للمطور</label>
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
                    <label className="text-[11px] font-bold text-slate-400">سنوات القسط المتبقية</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editingProperty.installment_years_left || 0}
                      onChange={(e) => setEditingProperty({ ...editingProperty, installment_years_left: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400">السعر الإجمالي النهائي</label>
                    <div className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold">
                      {formatEGP((editingProperty.paid_amount || 0) + (editingProperty.over_price || 0) + (editingProperty.remaining_installments || 0))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strict Supabase Free-Tier Image Uploader Component */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  صور الوحدة (مع الضغط التلقائي السحابي الفوري)
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
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  {isSaving ? 'جاري الحفظ...' : 'حفظ الوحدة'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
