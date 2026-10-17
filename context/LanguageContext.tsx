'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { translations, TranslationKey, Language } from '@/lib/translations';

interface LanguageContextType {
  lang: Language;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
  formatMoney: (amount: number | null | undefined) => string;
  formatNum: (num: number | null | undefined) => string;
  translateType: (type: string) => string;
  translateFinishing: (finishing: string) => string;
  translateDelivery: (delivery: string) => string;
  translateArea: (area: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');

  // Load persisted language from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('salino_language') as Language;
      if (saved === 'ar' || saved === 'en') {
        queueMicrotask(() => {
          setLangState(saved);
        });
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      } else {
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
      }
    } catch {
      // Fallback
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('salino_language', newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    } catch {
      // LocalStorage error
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState(prev => {
      const next = prev === 'ar' ? 'en' : 'ar';
      try {
        localStorage.setItem('salino_language', next);
        document.documentElement.lang = next;
        document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      } catch {
        // Fallback
      }
      return next;
    });
  }, []);

  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';
  const isRTL = dir === 'rtl';

  const contextValue = useMemo(() => {
    const t = (key: TranslationKey, fallback?: string): string => {
      const dict = translations[lang] as Record<string, string>;
      if (dict && dict[key]) {
        return dict[key];
      }
      const arDict = translations['ar'] as Record<string, string>;
      return fallback || (arDict && arDict[key]) || key;
    };

    const formatMoney = (amount: number | null | undefined): string => {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return lang === 'en' ? '0 EGP' : '0 ج.م';
      }
      const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {\n        maximumFractionDigits: 0,\n      }).format(amount);\n      return lang === 'en' ? `${formatted} EGP` : `${formatted} ج.م`;\n    };\n\n    const formatNum = (num: number | null | undefined): string => {\n      if (num === null || num === undefined || isNaN(num)) {\n        return '0';\n      }\n      return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(num);\n    };\n\n    const translateType = (type: string): string => {\n      if (lang === 'ar') return type;\n      const map: Record<string, string> = {\n        'شقة': 'Apartment',\n        'دوبلكس': 'Duplex',\n        'بنتهاوس': 'Penthouse',\n        'تاون هاوس': 'Townhouse',\n        'توين هاوس': 'Twin House',\n        'فيلا مستقلة': 'Standalone Villa',\n        'شاليه': 'Chalet',\n        'استوديو': 'Studio',\n        'الكل': 'All',\n      };\n      return map[type] || type;\n    };\n\n    const translateFinishing = (finishing: string): string => {\n      if (lang === 'ar') return finishing;\n      const map: Record<string, string> = {\n        'بدون تشطيب': 'Core & Shell',\n        'نصف تشطيب': 'Semi-Finished',\n        'تشطيب كامل': 'Fully Finished',\n        'سوبر لوكس': 'Super Lux',\n        'ألترا سوبر لوكس': 'Ultra Super Lux',\n      };\n      return map[finishing] || finishing;\n    };\n\n    const translateDelivery = (delivery: string): string => {\n      if (lang === 'ar') return delivery;\n      const map: Record<string, string> = {\n        'استلام فوري': 'Ready to Move',\n        'استلام خلال 6 أشهر': 'Within 6 Months',\n        'استلام خلال سنة': 'Within 1 Year',\n        'استلام 2026': 'Delivery 2026',\n        'استلام 2027': 'Delivery 2027',\n        'استلام 2028+': 'Delivery 2028+',\n      };\n      return map[delivery] || delivery;\n    };\n\n    const translateArea = (area: string): string => {\n      if (lang === 'ar') return area;\n      const map: Record<string, string> = {\n        'التجمع الخامس': 'New Cairo (5th Settlement)',\n        'الشيخ زايد': 'Sheikh Zayed & 6th of October',\n        'مستقبل سيتي': 'Mostakbal City',\n        'العاصمة الإدارية': 'New Administrative Capital',\n        'الساحل الشمالي': 'North Coast',\n        '6 أكتوبر': '6th of October',\n      };\n      return map[area] || area;\n    };\n\n    return {\n      lang,\n      dir,\n      isRTL,\n      setLang,\n      toggleLang,\n      t,\n      formatMoney,\n      formatNum,\n      translateType,\n      translateFinishing,\n      translateDelivery,\n      translateArea,\n    };\n  }, [lang, dir, isRTL, setLang, toggleLang]);\n\n  return (\n    <LanguageContext.Provider value={contextValue}>\n      {children}\n    </LanguageContext.Provider>\n  );\n}\n\nexport function useLanguage() {\n  const context = useContext(LanguageContext);\n  if (!context) {\n    throw new Error('useLanguage must be used within a LanguageProvider');\n  }\n  return context;\n}\n