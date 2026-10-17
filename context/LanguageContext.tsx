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
      const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
        maximumFractionDigits: 0,
      }).format(amount);
      return lang === 'en' ? `${formatted} EGP` : `${formatted} ج.م`;
    };

    const formatNum = (num: number | null | undefined): string => {
      if (num === null || num === undefined || isNaN(num)) {
        return '0';
      }
      return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(num);
    };

    const translateType = (type: string): string => {
      if (lang === 'ar') return type;
      const map: Record<string, string> = {
        'شقة': 'Apartment',
        'دوبلكس': 'Duplex',
        'بنتهاوس': 'Penthouse',
        'تاون هاوس': 'Townhouse',
        'توين هاوس': 'Twin House',
        'فيلا مستقلة': 'Standalone Villa',
        'شاليه': 'Chalet',
        'استوديو': 'Studio',
        'الكل': 'All',
      };
      return map[type] || type;
    };

    const translateFinishing = (finishing: string): string => {
      if (lang === 'ar') return finishing;
      const map: Record<string, string> = {
        'بدون تشطيب': 'Core & Shell',
        'نصف تشطيب': 'Semi-Finished',
        'تشطيب كامل': 'Fully Finished',
        'سوبر لوكس': 'Super Lux',
        'ألترا سوبر لوكس': 'Ultra Super Lux',
      };
      return map[finishing] || finishing;
    };

    const translateDelivery = (delivery: string): string => {
      if (lang === 'ar') return delivery;
      const map: Record<string, string> = {
        'استلام فوري': 'Ready to Move',
        'استلام خلال 6 أشهر': 'Within 6 Months',
        'استلام خلال سنة': 'Within 1 Year',
        'استلام 2026': 'Delivery 2026',
        'استلام 2027': 'Delivery 2027',
        'استلام 2028+': 'Delivery 2028+',
      };
      return map[delivery] || delivery;
    };

    const translateArea = (area: string): string => {
      if (lang === 'ar') return area;
      const map: Record<string, string> = {
        'التجمع الخامس': 'New Cairo (5th Settlement)',
        'الشيخ زايد': 'Sheikh Zayed & 6th of October',
        'مستقبل سيتي': 'Mostakbal City',
        'العاصمة الإدارية': 'New Administrative Capital',
        'الساحل الشمالي': 'North Coast',
        '6 أكتوبر': '6th of October',
      };
      return map[area] || area;
    };

    return {
      lang,
      dir,
      isRTL,
      setLang,
      toggleLang,
      t,
      formatMoney,
      formatNum,
      translateType,
      translateFinishing,
      translateDelivery,
      translateArea,
    };
  }, [lang, dir, isRTL, setLang, toggleLang]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
