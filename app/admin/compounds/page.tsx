'use client';

import { useState, useEffect } from 'react';
import { Compound } from '@/types/database';
import { getCompounds } from '@/lib/dataService';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { 
  Building, 
  PlusCircle, 
  Edit, 
  CheckCircle2, 
  X, 
  Search
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminCompoundsPage() {
  const { t, lang, translateArea } = useLanguage();
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompound, setEditingCompound] = useState<Partial<Compound> | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCompounds().then((data) => {
      if (isMounted) {
        setCompounds(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingCompound({
      name_ar: '',
      name_en: '',
      area_name: 'التجمع الخامس',
      developer_name: '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompound || !editingCompound.name_ar) return;

    const newCompound: Compound = {
      id: editingCompound.id || `comp-${Date.now()}`,
      name_ar: editingCompound.name_ar,
      name_en: editingCompound.name_en || editingCompound.name_ar,
      area_name: editingCompound.area_name || 'التجمع الخامس',
      developer_name: editingCompound.developer_name || 'مطور عقاري معتمد',
    };

    if (isSupabaseConfigured) {
      await supabase.from('compounds').upsert(newCompound);
    }

    setCompounds((prev) => {
      const idx = prev.findIndex((c) => c.id === newCompound.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = newCompound;
        return copy;
      }
      return [newCompound, ...prev];
    });

    setNotice(
      lang === 'ar'
        ? `تم حفظ بيانات الكمبوند (${newCompound.name_ar}) بنجاح!`
        : `Compound (${newCompound.name_en || newCompound.name_ar}) saved successfully!`
    );
    setIsModalOpen(false);
  };

  const filtered = compounds.filter(
    (c) =>
      c.name_ar.toLowerCase().includes(search.toLowerCase()) ||
      (c.name_en && c.name_en.toLowerCase().includes(search.toLowerCase())) ||
      c.area_name.toLowerCase().includes(search.toLowerCase()) ||
      c.developer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('admin.comps.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('admin.comps.subtitle')}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>{t('admin.comps.addNew')}</span>
        </button>
      </div>

      {notice && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={t('admin.comps.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl ps-10 pe-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 text-start">{t('admin.comps.colNameAr')}</th>
                <th className="py-3.5 px-4 text-start">{t('admin.comps.colNameEn')}</th>
                <th className="py-3.5 px-4 text-start">{t('admin.comps.colArea')}</th>
                <th className="py-3.5 px-4 text-start">{t('admin.comps.colDeveloper')}</th>
                <th className="py-3.5 px-4 text-center">{t('admin.comps.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    {t('admin.comps.loading')}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    {t('admin.comps.noComps')}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{c.name_ar}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-sans">{c.name_en || '-'}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-800 text-amber-300 font-semibold px-2 py-0.5 rounded text-[11px]">
                      {translateArea(c.area_name)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{c.developer_name}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        setEditingCompound({ ...c });
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg cursor-pointer"
                      title={t('admin.common.edit')}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingCompound && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                {editingCompound.id ? t('admin.comps.editModalTitle') : t('admin.comps.addModalTitle')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">{t('admin.comps.nameArLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: ميفيدا (Mivida)' : 'e.g. ميفيدا (Mivida)'}
                  value={editingCompound.name_ar || ''}
                  onChange={(e) => setEditingCompound({ ...editingCompound, name_ar: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">{t('admin.comps.nameEnLabel')}</label>
                <input
                  type="text"
                  placeholder="e.g. Mivida"
                  value={editingCompound.name_en || ''}
                  onChange={(e) => setEditingCompound({ ...editingCompound, name_en: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">{t('admin.comps.areaLabel')}</label>
                <select
                  value={editingCompound.area_name || 'التجمع الخامس'}
                  onChange={(e) => setEditingCompound({ ...editingCompound, area_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="التجمع الخامس">{lang === 'ar' ? 'التجمع الخامس (القاهرة الجديدة)' : 'New Cairo (5th Settlement)'}</option>
                  <option value="الشيخ زايد">{lang === 'ar' ? 'الشيخ زايد' : 'Sheikh Zayed'}</option>
                  <option value="6 أكتوبر">{lang === 'ar' ? '6 أكتوبر' : '6th of October'}</option>
                  <option value="مستقبل سيتي">{lang === 'ar' ? 'مدينة المستقبل (Mostakbal City)' : 'Mostakbal City'}</option>
                  <option value="العاصمة الإدارية">{lang === 'ar' ? 'العاصمة الإدارية الجديدة' : 'New Administrative Capital'}</option>
                  <option value="الساحل الشمالي">{lang === 'ar' ? 'الساحل الشمالي' : 'North Coast'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">{t('admin.comps.devLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: إعمار مصر (Emaar Misr)' : 'e.g. Emaar Misr'}
                  value={editingCompound.developer_name || ''}
                  onChange={(e) => setEditingCompound({ ...editingCompound, developer_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {t('admin.common.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-xl cursor-pointer"
                >
                  {t('admin.comps.saveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
