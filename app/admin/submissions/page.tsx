'use client';

import { useState, useEffect } from 'react';
import { SellerSubmission, Compound, LeadPriority, SubmissionStatus } from '@/types/database';
import { 
  getSellerSubmissions, 
  updateSubmission, 
  deleteSubmission,
  saveProperty, 
  getCompounds 
} from '@/lib/dataService';
import { generateReferenceCode } from '@/lib/utils';
import { 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Search, 
  Download, 
  FileText, 
  Kanban, 
  Table as TableIcon, 
  Flame, 
  Zap, 
  Snowflake, 
  TrendingUp, 
  Layers, 
  X,
  Trash2,
  DollarSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const { t, lang, formatMoney, translateType } = useLanguage();
  const [submissions, setSubmissions] = useState<SellerSubmission[]>([]);
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Views
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Notes Modal State
  const [activeNotesSub, setActiveNotesSub] = useState<SellerSubmission | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getSellerSubmissions(), getCompounds()]).then(([subsData, compsData]) => {
      if (isMounted) {
        setSubmissions(subsData);
        setCompounds(compsData);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update Status in CRM
  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    await updateSubmission(id, { status: newStatus });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    showNotice(t('admin.subs.statusUpdated'));
  };

  // Update Priority in CRM
  const handlePriorityChange = async (id: string, newPriority: LeadPriority) => {
    await updateSubmission(id, { priority: newPriority });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, priority: newPriority } : s))
    );
    showNotice(lang === 'ar' ? 'تم تحديث أولوية العميل' : 'Lead priority updated');
  };

  // Open Notes Modal
  const openNotesModal = (sub: SellerSubmission) => {
    setActiveNotesSub(sub);
    setNotesInput(sub.internal_notes || sub.notes || '');
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!activeNotesSub) return;
    setIsSavingNotes(true);
    await updateSubmission(activeNotesSub.id, { internal_notes: notesInput });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === activeNotesSub.id ? { ...s, internal_notes: notesInput } : s))
    );
    setIsSavingNotes(false);
    setActiveNotesSub(null);
    showNotice(lang === 'ar' ? 'تم حفظ الملاحظات الداخلية بنجاح' : 'Internal notes saved successfully');
  };

  // Delete Lead
  const handleDelete = async (id: string) => {
    if (confirm(t('admin.subs.deleteConfirm'))) {
      await deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      showNotice(lang === 'ar' ? 'تم حذف الطلب بنجاح' : 'Lead deleted successfully');
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // 1-Click "Convert to Resale Listing"
  const handleConvertToPropertyDraft = async (sub: SellerSubmission) => {
    const matchedCompound = compounds.find(
      (c) => c.name_ar.includes(sub.compound_name) || sub.compound_name.includes(c.name_ar)
    ) || compounds[0];

    const refCode = generateReferenceCode(10);
    const paid = sub.paid_amount || 0;
    const over = sub.over_price || 0;
    const remaining = sub.remaining_amount || 0;
    const totalDown = paid + over;
    const totalPrice = totalDown + remaining;

    const draftProperty = {
      reference_code: refCode,
      title_ar: `${sub.property_type} ريسيل في ${sub.compound_name} مساحة ${sub.area_sqm}م²`,
      description_ar: `عرض ريسيل مقدم من المالك مباشرة في كمبوند ${sub.compound_name}.\nالمساحة: ${sub.area_sqm} متر مربع.\nملاحظات المالك: ${sub.notes || 'استلام قريب وتسهيلات في السداد'}.\nملاحظات الإدارة: ${sub.internal_notes || ''}`,
      compound_id: matchedCompound?.id,
      property_type: sub.property_type || 'شقة',
      area_sqm: sub.area_sqm || 150,
      bedrooms: 3,
      bathrooms: 2,
      floor_number: 2,
      finishing_type: 'نصف تشطيب',
      delivery_status: 'استلام قريب',
      original_price: paid + remaining,
      paid_amount: paid,
      over_price: over,
      total_down_payment: totalDown,
      remaining_installments: remaining,
      total_price: totalPrice,
      installment_years_left: 3,
      maintenance_fee: Math.round(totalPrice * 0.08),
      transfer_fee: Math.round(totalPrice * 0.02),
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ],
      status: 'pending' as const,
      is_featured: false,
    };

    const saved = await saveProperty(draftProperty);
    await handleStatusChange(sub.id, 'listed');

    alert(
      lang === 'ar'
        ? `تم تحويل طلب المالك بنجاح إلى مسودة إعلان كود ${saved.reference_code}! جاري نقلك لصفحة إدارة العقارات لإضافة الصور وإطلاق الإعلان.`
        : `Owner submission converted to listing draft (Ref: ${saved.reference_code})! Navigating to properties management to upload photos & publish.`
    );
    router.push('/admin/properties');
  };

  // Export Pipeline to CSV
  const exportToCSV = () => {
    const headers = [
      'ID',
      'Owner Name',
      'Phone',
      'Compound',
      'Type',
      'Area (sqm)',
      'Paid to Dev (EGP)',
      'Over-Price (EGP)',
      'Required Cash (EGP)',
      'Remaining Installments (EGP)',
      'Total Expected (EGP)',
      'Status',
      'Priority',
      'Assigned Agent',
      'Owner Notes',
      'Internal Notes',
      'Created Date'
    ];

    const rows = filteredSubmissions.map((s) => [
      s.id,
      `"${s.owner_name.replace(/"/g, '""')}"`,
      `"${s.owner_phone}"`,
      `"${s.compound_name.replace(/"/g, '""')}"`,
      `"${s.property_type}"`,
      s.area_sqm,
      s.paid_amount,
      s.over_price,
      (s.paid_amount || 0) + (s.over_price || 0),
      s.remaining_amount || 0,
      (s.paid_amount || 0) + (s.over_price || 0) + (s.remaining_amount || 0),
      s.status,
      s.priority || 'warm',
      `"${(s.assigned_agent || '').replace(/"/g, '""')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
      `"${(s.internal_notes || '').replace(/"/g, '""')}"`,
      s.created_at || ''
    ]);

    // Prepend UTF-8 BOM so Excel opens Arabic correctly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salino_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotice(lang === 'ar' ? 'تم تصدير ملف العملاء بنجاح' : 'CRM leads exported to CSV');
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((s) => {
    // Stage
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    // Priority
    if (priorityFilter !== 'all' && s.priority !== priorityFilter) return false;
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = s.owner_name.toLowerCase().includes(q);
      const matchPhone = s.owner_phone.includes(q);
      const matchCompound = s.compound_name.toLowerCase().includes(q);
      const matchType = (s.property_type || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCompound && !matchType) return false;
    }
    return true;
  });

  // CRM Pipeline KPI Calculations
  const total = submissions.length;
  const hotCount = submissions.filter(
    (s) => s.priority === 'hot' || (s.paid_amount && s.over_price && (s.over_price / s.paid_amount) <= 0.15)
  ).length;
  const activeSubs = submissions.filter((s) => s.status !== 'rejected');
  const cashVolume = activeSubs.reduce((acc, curr) => acc + (curr.paid_amount || 0) + (curr.over_price || 0), 0);
  const assetVolume = activeSubs.reduce((acc, curr) => acc + (curr.paid_amount || 0) + (curr.over_price || 0) + (curr.remaining_amount || 0), 0);
  const listedCount = submissions.filter((s) => s.status === 'listed').length;
  const conversionRate = total > 0 ? Math.round((listedCount / total) * 100) : 0;
  const kpiData = { total, hotCount, cashVolume, assetVolume, conversionRate };

  const stages: Array<{ id: SubmissionStatus; label: string; color: string; bg: string }> = [
    { id: 'new', label: t('admin.subs.stageNew'), color: 'border-blue-500/40 text-blue-400', bg: 'bg-blue-950/20' },
    { id: 'contacted', label: t('admin.subs.stageContacted'), color: 'border-amber-500/40 text-amber-400', bg: 'bg-amber-950/20' },
    { id: 'meeting', label: t('admin.subs.stageMeeting'), color: 'border-purple-500/40 text-purple-400', bg: 'bg-purple-950/20' },
    { id: 'negotiation', label: t('admin.subs.stageNegotiation'), color: 'border-orange-500/40 text-orange-400', bg: 'bg-orange-950/20' },
    { id: 'listed', label: t('admin.subs.stageListed'), color: 'border-emerald-500/40 text-emerald-400', bg: 'bg-emerald-950/20' },
    { id: 'rejected', label: t('admin.subs.stageRejected'), color: 'border-rose-500/40 text-rose-400', bg: 'bg-rose-950/20' },
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {t('admin.subs.title')}
            </h1>
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Supabase CRM
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('admin.subs.subtitle')}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Toggle */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>{t('admin.subs.viewKanban')}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>{t('admin.subs.viewTable')}</span>
            </button>
          </div>

          {/* Export to CSV */}
          <button
            onClick={exportToCSV}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-amber-400 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV for Excel"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('admin.subs.exportCsv')}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t('admin.subs.kpiTotal')}</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpiData.total}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{lang === 'ar' ? 'طلب ريسيل مسجل' : 'resale requests'}</div>
        </div>

        <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-slate-900 to-amber-950/20">
          <div className="flex items-center justify-between text-amber-400 text-xs mb-1">
            <span className="font-bold">{t('admin.subs.kpiHot')}</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{kpiData.hotCount}</div>
          <div className="text-[11px] text-amber-400/80 mt-0.5">{lang === 'ar' ? 'أوفر أقل من 15%' : 'Over < 15% (Fast Cash)'}</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-slate-900 to-emerald-950/20">
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-1">
            <span className="font-bold">{t('admin.subs.kpiCash')}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{formatMoney(kpiData.cashVolume)}</div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">{lang === 'ar' ? 'مقدمات وأوفر الملاك' : 'Cash Down + Over'}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-4 shadow-lg col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t('admin.subs.kpiAssets')}</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-slate-200">{formatMoney(kpiData.assetVolume)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{lang === 'ar' ? 'شامل أقساط المطورين' : 'Gross Portfolio Value'}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-4 shadow-lg col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{t('admin.subs.kpiConv')}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{kpiData.conversionRate}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{lang === 'ar' ? 'تم تحويلها لإعلانات' : 'converted to listings'}</div>
        </div>

      </div>

      {/* Search & Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3.5 shadow-lg">
        
        {/* Top Row: Search and Priorities */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث بالاسم، رقم الهاتف، أو الكمبوند...' : 'Search by name, phone, or compound...'}
              className="w-full bg-slate-950 border border-slate-700/80 text-white text-xs rounded-xl ps-10 pe-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-500 text-[11px] font-bold me-1">{t('admin.subs.filterPriority')}</span>
            {[
              { id: 'all', label: t('admin.subs.prioAll') },
              { id: 'hot', label: t('admin.subs.prioHot'), icon: Flame, color: 'text-rose-400' },
              { id: 'warm', label: t('admin.subs.prioWarm'), icon: Zap, color: 'text-amber-400' },
              { id: 'cold', label: t('admin.subs.prioCold'), icon: Snowflake, color: 'text-blue-400' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPriorityFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  priorityFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Stage Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs border-t border-slate-800/80 pt-3">
          <span className="text-slate-500 text-[11px] font-bold me-1">{t('admin.subs.filterStage')}</span>
          {[
            { id: 'all', label: t('admin.subs.tabAll') },
            ...stages
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                statusFilter === st.id
                  ? 'bg-slate-200 text-slate-950 font-black'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

      </div>

      {/* Action Notice Toast */}
      {actionNotice && (
        <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold">{actionNotice}</span>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="animate-pulse space-y-2">
            <Layers className="w-8 h-8 text-amber-500/50 mx-auto" />
            <p className="text-sm font-bold">{t('admin.subs.loading')}</p>
          </div>
        </div>
      ) : viewMode === 'kanban' ? (
        /* ======================== KANBAN PIPELINE VIEW ======================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
          {stages.map((stage) => {
            const stageLeads = filteredSubmissions.filter((s) => s.status === stage.id);
            const stageCashTotal = stageLeads.reduce((acc, curr) => acc + (curr.paid_amount || 0) + (curr.over_price || 0), 0);

            return (
              <div 
                key={stage.id} 
                className="bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col min-h-[500px] shadow-lg"
              >
                {/* Stage Header */}
                <div className={`p-3.5 border-b border-slate-800 rounded-t-2xl ${stage.bg} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-white">{stage.label}</span>
                    <span className="bg-slate-900/80 border border-slate-700/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                      {stageLeads.length}
                    </span>
                  </div>
                  {stageCashTotal > 0 && (
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {formatMoney(stageCashTotal)}
                    </span>
                  )}
                </div>

                {/* Cards Container */}
                <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto max-h-[75vh]">
                  {stageLeads.length > 0 ? (
                    stageLeads.map((sub) => {
                      const cleanPhone = sub.owner_phone.replace(/[^0-9]/g, '');
                      const whatsappMsg = lang === 'ar'
                        ? `مرحباً أستاذ ${sub.owner_name}، نتواصل معك من سالينو ريسيل بخصوص وحدتك في كمبوند ${sub.compound_name}. يسعدنا مراجعة كشف حساب المطور لتجهيز المشتري الكاش فوراً.`
                        : `Hello ${sub.owner_name}, we are contacting you from Salino Resale regarding your resale unit in ${sub.compound_name}.`;
                      const whatsappUrl = `https://wa.me/2${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

                      const calculatedDown = (sub.paid_amount || 0) + (sub.over_price || 0);
                      const priority = sub.priority || 'warm';

                      return (
                        <div
                          key={sub.id}
                          className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 shadow-md transition-all hover:scale-[1.01] space-y-2.5 group"
                        >
                          {/* Priority & Time */}
                          <div className="flex items-center justify-between text-[11px]">
                            {/* Priority Selector Pill */}
                            <select
                              value={priority}
                              onChange={(e) => handlePriorityChange(sub.id, e.target.value as LeadPriority)}
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full border cursor-pointer bg-slate-900 focus:outline-none ${
                                priority === 'hot'
                                  ? 'border-rose-500/50 text-rose-300'
                                  : priority === 'warm'
                                  ? 'border-amber-500/50 text-amber-300'
                                  : 'border-blue-500/50 text-blue-300'
                              }`}
                            >
                              <option value="hot">🔥 Hot</option>
                              <option value="warm">⚡ Warm</option>
                              <option value="cold">❄ Cold</option>
                            </select>

                            <span className="text-slate-500 text-[10px] flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {sub.created_at ? sub.created_at.slice(5, 10) : ''}
                            </span>
                          </div>

                          {/* Owner Name & Phone */}
                          <div>
                            <div className="font-bold text-white text-xs flex items-center justify-between">
                              <span className="truncate">{sub.owner_name}</span>
                            </div>
                            <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                              {sub.owner_phone}
                            </div>
                          </div>

                          {/* Property & Compound */}
                          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 text-[11px] space-y-1">
                            <div className="text-amber-400 font-bold truncate">
                              {translateType(sub.property_type)} - {sub.compound_name}
                            </div>
                            <div className="text-slate-400 text-[10px] flex items-center justify-between">
                              <span>{sub.area_sqm} م²</span>
                              <span className="text-emerald-400 font-bold font-mono">
                                {formatMoney(calculatedDown)}
                              </span>
                            </div>
                          </div>

                          {/* Quick Notes Snippet */}
                          {(sub.internal_notes || sub.notes) && (
                            <div 
                              onClick={() => openNotesModal(sub)}
                              className="text-[10px] text-slate-400 line-clamp-2 bg-slate-900/40 p-1.5 rounded border border-slate-800/40 cursor-pointer hover:text-slate-200"
                              title="Click to view/edit notes"
                            >
                              💬 {sub.internal_notes || sub.notes}
                            </div>
                          )}

                          {/* Quick Contact & Action Buttons */}
                          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/80">
                            
                            <div className="flex items-center gap-1">
                              {/* WhatsApp */}
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>

                              {/* Phone Call */}
                              <a
                                href={`tel:${sub.owner_phone}`}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Call"
                              >
                                <Phone className="w-3.5 h-3.5 text-amber-400" />
                              </a>

                              {/* Notes */}
                              <button
                                onClick={() => openNotesModal(sub)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 rounded-lg transition-colors cursor-pointer"
                                title="Internal Notes"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Convert to Listing or Stage Progress */}
                            <div className="flex items-center gap-1">
                              {sub.status !== 'listed' && (
                                <button
                                  onClick={() => handleConvertToPropertyDraft(sub)}
                                  className="p-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  title={t('admin.subs.convertDraft')}
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(sub.id)}
                                className="p-1.5 hover:bg-rose-500/20 text-slate-600 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>

                          {/* Quick Stage Change Selector */}
                          <div className="pt-0.5">
                            <select
                              value={sub.status}
                              onChange={(e) => handleStatusChange(sub.id, e.target.value as SubmissionStatus)}
                              className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] py-1 px-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                            >
                              {stages.map((st) => (
                                <option key={st.id} value={st.id}>
                                  {st.label}
                                </option>
                              ))}
                            </select>
                          </div>

                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-slate-600 text-xs font-medium">
                      {lang === 'ar' ? 'لا توجد صفقات هنا' : 'Empty stage'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ======================== TABLE VIEW ======================== */
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 text-start">{t('admin.subs.ownerName')}</th>
                  <th className="py-3 px-4 text-start">{t('admin.subs.unitSpecs')}</th>
                  <th className="py-3 px-4 text-start">{t('admin.subs.filterPriority')}</th>
                  <th className="py-3 px-4 text-start">{t('admin.props.calcDownPayment')}</th>
                  <th className="py-3 px-4 text-start">{t('admin.subs.overReq')}</th>
                  <th className="py-3 px-4 text-start">{t('admin.subs.filterStage')}</th>
                  <th className="py-3 px-4 text-center">{t('admin.common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((sub) => {
                    const cleanPhone = sub.owner_phone.replace(/[^0-9]/g, '');
                    const whatsappMsg = lang === 'ar'
                      ? `مرحباً أستاذ ${sub.owner_name}، نتواصل معك من سالينو ريسيل بخصوص وحدتك في كمبوند ${sub.compound_name}.`
                      : `Hello ${sub.owner_name}, reaching out from Salino Resale.`;
                    const whatsappUrl = `https://wa.me/2${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;
                    const calculatedDown = (sub.paid_amount || 0) + (sub.over_price || 0);
                    const priority = sub.priority || 'warm';

                    return (
                      <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                        
                        {/* Owner */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{sub.owner_name}</div>
                          <div className="text-slate-400 text-[11px] font-mono">{sub.owner_phone}</div>
                          <div className="text-slate-500 text-[10px] mt-0.5">{sub.created_at?.slice(0, 10)}</div>
                        </td>

                        {/* Specs */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-amber-400">{sub.compound_name}</div>
                          <div className="text-slate-300 text-[11px]">{translateType(sub.property_type)} - {sub.area_sqm} م²</div>
                          {sub.internal_notes && (
                            <div className="text-slate-400 text-[10px] mt-0.5 truncate max-w-[200px]" title={sub.internal_notes}>
                              💬 {sub.internal_notes}
                            </div>
                          )}
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4">
                          <select
                            value={priority}
                            onChange={(e) => handlePriorityChange(sub.id, e.target.value as LeadPriority)}
                            className={`text-[10px] font-black px-2.5 py-1 rounded-full border cursor-pointer bg-slate-950 focus:outline-none ${
                              priority === 'hot'
                                ? 'border-rose-500/50 text-rose-300'
                                : priority === 'warm'
                                ? 'border-amber-500/50 text-amber-300'
                                : 'border-blue-500/50 text-blue-300'
                            }`}
                          >
                            <option value="hot">🔥 Hot</option>
                            <option value="warm">⚡ Warm</option>
                            <option value="cold">❄ Cold</option>
                          </select>
                        </td>

                        {/* Down Payment */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-emerald-400 font-mono text-xs">
                            {formatMoney(calculatedDown)}
                          </div>
                          <div className="text-slate-500 text-[10px]">
                            {lang === 'ar' ? 'مدفوع: ' : 'Paid: '} {formatMoney(sub.paid_amount)}
                          </div>
                        </td>

                        {/* Over */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-amber-400 font-mono text-xs">
                            {formatMoney(sub.over_price)}
                          </div>
                        </td>

                        {/* Stage Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={sub.status}
                            onChange={(e) => handleStatusChange(sub.id, e.target.value as SubmissionStatus)}
                            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                          >
                            {stages.map((st) => (
                              <option key={st.id} value={st.id}>
                                {st.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>

                            <a
                              href={`tel:${sub.owner_phone}`}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5 text-amber-400" />
                            </a>

                            <button
                              onClick={() => openNotesModal(sub)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 rounded-lg transition-colors cursor-pointer"
                              title="Internal Notes"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {sub.status !== 'listed' && (
                              <button
                                onClick={() => handleConvertToPropertyDraft(sub)}
                                className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title={t('admin.subs.convertDraft')}
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{lang === 'ar' ? 'إدراج' : 'List'}</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="p-1.5 hover:bg-rose-500/20 text-slate-600 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      {t('admin.subs.noSubs')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================== INTERNAL NOTES MODAL ======================== */}
      {activeNotesSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>{t('admin.subs.notesModalTitle')}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeNotesSub.owner_name} - {activeNotesSub.compound_name} ({activeNotesSub.owner_phone})
                </p>
              </div>
              <button
                onClick={() => setActiveNotesSub(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Owner original notes */}
            {activeNotesSub.notes && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="text-slate-500 font-bold block mb-0.5">{t('admin.subs.ownerNotes')}</span>
                <span>{activeNotesSub.notes}</span>
              </div>
            )}

            {/* Internal Notes Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {t('admin.subs.notesBtn')}
              </label>
              <textarea
                rows={5}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder={t('admin.subs.notesPlaceholder')}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveNotesSub(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {t('admin.common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition-all hover:scale-102 cursor-pointer shadow-md shadow-amber-500/20"
              >
                {isSavingNotes ? t('admin.common.saving') : t('admin.subs.saveNotes')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
