'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  PlusCircle, 
  Menu, 
  X, 
  Shield, 
  Heart, 
  MessageCircle, 
  Search,
  Sparkles 
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const updateFavs = () => {
      try {
        const favs = JSON.parse(localStorage.getItem('salino_favorites') || '[]');
        setFavoriteCount(favs.length);
      } catch {
        // Fallback
      }
    };
    updateFavs();
    window.addEventListener('storage', updateFavs);
    return () => window.removeEventListener('storage', updateFavs);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 text-white shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                سالينو <span className="text-amber-400 font-black text-xs sm:text-sm px-2 py-0.5 rounded-lg bg-amber-400/15 border border-amber-400/30">ريسيل</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">سوق إعادة البيع العقاري المعتمد في مصر</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-slate-300">
            <Link 
              href="/" 
              className={`transition-colors py-1 ${pathname === '/' ? 'text-amber-400 font-black' : 'hover:text-amber-400'}`}
            >
              الرئيسية
            </Link>
            <Link 
              href="/properties" 
              className={`transition-colors py-1 ${pathname === '/properties' ? 'text-amber-400 font-black' : 'hover:text-amber-400'}`}
            >
              وحدات الريسيل
            </Link>
            <Link 
              href="/#areas" 
              className="hover:text-amber-400 transition-colors py-1"
            >
              المناطق والكمبوندات
            </Link>
            <Link 
              href="/#calculator" 
              className="hover:text-amber-400 transition-colors py-1 flex items-center gap-1"
            >
              <span>احسب ميزانيتك</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </Link>
            <Link 
              href="/admin" 
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs py-1.5 px-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              لوحة الإدارة
            </Link>
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* WhatsApp Quick Chat */}
            <a
              href="https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D9%81%D8%B1%D8%B5%20%D8%A7%D9%84%D8%B1%D9%8A%D8%B3%D9%8A%D9%84%20%D8%A7%D9%84%D9%85%D8%AA%D8%A7%D8%AD%D8%A9"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 transition-all cursor-pointer"
              title="تواصل واتساب مباشر"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </a>

            {/* Sell Unit CTA */}
            <Link
              href="/sell"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-102 active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>اعرض وحدتك للبيع</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/sell"
              className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>اعرض وحدتك</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 focus:outline-none"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/98 border-b border-white/10 px-5 pt-4 pb-7 space-y-3 animate-fadeIn">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-200 hover:bg-slate-900 hover:text-amber-400"
          >
            الرئيسية
          </Link>
          <Link
            href="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-200 hover:bg-slate-900 hover:text-amber-400"
          >
            كل وحدات الريسيل المعروضة
          </Link>
          <Link
            href="/#areas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-200 hover:bg-slate-900 hover:text-amber-400"
          >
            تصفح بالمناطق والكمبوندات
          </Link>
          <Link
            href="/#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-200 hover:bg-slate-900 hover:text-amber-400"
          >
            حاسبة القدرة الشرائية للريسيل
          </Link>
          <Link
            href="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-3 rounded-xl text-base font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 shadow-md"
          >
            اعرض وحدتك للبيع كاش (ملاك فقط)
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white"
          >
            لوحة الإدارة (Admin)
          </Link>
        </div>
      )}
    </header>
  );
}
