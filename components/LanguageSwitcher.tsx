'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'navbar' | 'footer' | 'mobile';
}

export default function LanguageSwitcher({ 
  className = '',
  variant = 'navbar' 
}: LanguageSwitcherProps) {
  const { lang, toggleLang } = useLanguage();

  if (variant === 'footer') {
    return (
      <button
        onClick={toggleLang}
        type="button"
        className={`flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 py-1.5 px-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 transition-all cursor-pointer ${className}`}
        aria-label="Switch Language / تغيير اللغة"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400" />
        <span>{lang === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>
      </button>
    );
  }

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggleLang}
        type="button"
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold bg-slate-900 border border-slate-800 text-slate-200 hover:text-amber-400 transition-colors ${className}`}
      >
        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>{lang === 'ar' ? 'اللغة: العربية (RTL)' : 'Language: English (LTR)'}</span>
        </span>
        <span className="text-xs bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-md font-mono">
          {lang === 'ar' ? 'EN' : 'عربي'}
        </span>
      </button>
    );
  }

  // Default navbar variant
  return (
    <button
      onClick={toggleLang}
      type="button"
      className={`flex items-center gap-1.5 text-xs font-black py-1.5 px-2.5 sm:px-3 rounded-xl border border-slate-700/80 hover:border-amber-400/60 bg-slate-900/80 hover:bg-slate-900 text-slate-200 hover:text-amber-400 shadow-sm transition-all cursor-pointer hover:scale-102 active:scale-98 ${className}`}
      title={lang === 'ar' ? 'Switch to English (LTR)' : 'التبديل إلى العربية (RTL)'}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span className="font-sans font-bold tracking-wide">
        {lang === 'ar' ? 'EN' : 'عربي'}
      </span>
    </button>
  );
}
