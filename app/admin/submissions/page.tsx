'use client';

import { useState, useEffect } from 'react';
import { SellerSubmission, Compound } from '@/types/database';
import { 
  getSellerSubmissions, 
  updateSubmissionStatus, 
  saveProperty, 
  getCompounds 
} from '@/lib/dataService';
import { formatEGP, generateReferenceCode } from '@/lib/utils';
import { 
  Inbox, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Building, 
  Coins, 
  ExternalLink,
  Clock,
  Send
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SellerSubmission[]>([]);
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [subsData, compsData] = await Promise.all([
      getSellerSubmissions(),
      getCompounds(),
    ]);
    setSubmissions(subsData);
    setCompounds(compsData);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: SellerSubmission['status']) => {
    await updateSubmissionStatus(id, newStatus);
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    setActionNotice('تم تحديث حالة طلب المالك بنجاح!');
  };

  // 1-Click "Convert to Property Draft" (Required Feature)
  const handleConvertToPropertyDraft = async (sub: SellerSubmission) => {
    // Find matching compound or default to first
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
      description_ar: `عرض ريسيل مقدم من المالك مباشرة في كمبوند ${sub.compound_name}.\nالمساحة: ${sub.area_sqm} متر مربع.\nملاحظات المالك: ${sub.notes || 'استلام قريب وتسهيلات في السداد'}.`,
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
    await updateSubmissionStatus(sub.id, 'listed');

    alert(`تم تحويل طلب المالك بنجاح إلى مسودة إعلان كود ${saved.reference_code}! جاري نقلك لصفحة إدارة العقارات لإضافة الصور وإطلاق الإعلان.`);
    router.push('/admin/properties');
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (statusFilter === 'all') return true;
    return s.status === statusFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            صندوق طلبات عروض الملاك (Seller Leads)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            مراجعة بيانات الوحدات المسجلة من الملاك، التواصل معهم، وتحويلها بضغطة زر إلى إعلانات
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'كافة الطلبات' },
            { id: 'new', label: 'طلبات جديدة' },
            { id: 'contacted', label: 'تم التواصل' },
            { id: 'listed', label: 'تم الإدراج' },
            { id: 'rejected', label: 'مرفوض' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {actionNotice && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((sub) => {
            const cleanPhone = sub.owner_phone.replace(/[^0-9]/g, '');
            const whatsappMsg = `السلام عليكم أستاذ ${sub.owner_name}، نتواصل معك من منصة سالينو ريسيل بخصوص طلبك لعرض وحدتك في كمبوند ${sub.compound_name}.`;
            const whatsappUrl = `https://wa.me/2${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

            const calculatedDown = (sub.paid_amount || 0) + (sub.over_price || 0);
            const calculatedTotal = calculatedDown + (sub.remaining_amount || 0);

            return (
              <div
                key={sub.id}
                className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      {sub.owner_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-base">{sub.owner_name}</span>
                        <span className="text-xs text-slate-400 font-mono">({sub.owner_phone})</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>سجل في: {sub.created_at ? sub.created_at.slice(0, 10) : '2025-02-15'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Pill */}
                  <div className="flex items-center gap-2.5">
                    {/* Status dropdown */}
                    <select
                      value={sub.status}
                      onChange={(e) => handleStatusChange(sub.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="new">طلب جديد (New)</option>
                      <option value="contacted">تم التواصل (Contacted)</option>
                      <option value="listed">تم الإدراج كإعلان (Listed)</option>
                      <option value="rejected">مرفوض / غير متاح (Rejected)</option>
                    </select>

                    {/* WhatsApp */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs flex items-center gap-1 transition-colors"
                      title="مراسلة واتساب"
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                      <span className="hidden sm:inline">واتساب</span>
                    </a>

                    {/* Phone */}
                    <a
                      href={`tel:${sub.owner_phone}`}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1 transition-colors"
                      title="اتصال هاتفي"
                    >
                      <Phone className="w-4 h-4 text-amber-400" />
                      <span className="hidden sm:inline">اتصال</span>
                    </a>
                  </div>
                </div>

                {/* Property & Financial Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                    <span className="text-slate-500 block">الكمبوند والنوع:</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">
                      {sub.property_type} في {sub.compound_name}
                    </span>
                    <span className="text-slate-400 text-[11px]">المساحة: {sub.area_sqm} م²</span>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                    <span className="text-slate-500 block">المدفوع للشركة:</span>
                    <span className="font-bold text-slate-200 text-sm mt-0.5 block">
                      {formatEGP(sub.paid_amount)}
                    </span>
                    <span className="text-slate-400 text-[11px]">أقساط مسددة</span>
                  </div>

                  <div className="bg-amber-950/30 p-3.5 rounded-2xl border border-amber-500/20">
                    <span className="text-amber-400 block font-bold">الأوفر برايس المطلوب:</span>
                    <span className="font-black text-amber-300 text-sm mt-0.5 block">
                      {formatEGP(sub.over_price)}
                    </span>
                    <span className="text-amber-400/80 text-[11px]">صافي للمالك</span>
                  </div>

                  <div className="bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-500/20">
                    <span className="text-emerald-400 block font-bold">إجمالي المطلوب كاش:</span>
                    <span className="font-black text-emerald-300 text-sm mt-0.5 block">
                      {formatEGP(calculatedDown)}
                    </span>
                    <span className="text-emerald-400/80 text-[11px]">
                      الإجمالي: {formatEGP(calculatedTotal)}
                    </span>
                  </div>

                </div>

                {/* Owner Notes */}
                {sub.notes && (
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 text-xs text-slate-300">
                    <strong className="text-slate-400">ملاحظات المالك: </strong>
                    <span>{sub.notes}</span>
                  </div>
                )}

                {/* 1-Click Convert to Property Draft Button */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => handleConvertToPropertyDraft(sub)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-102 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>تحويل لطلب إعلان وحدة (Convert to Property Draft)</span>
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 text-slate-400">
            لا توجد طلبات في هذا القسم حالياً.
          </div>
        )}
      </div>

    </div>
  );
}
