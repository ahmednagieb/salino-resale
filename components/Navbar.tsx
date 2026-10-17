'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, PlusCircle, Menu, X, Shield, PhoneCall } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                سالينو <span className="text-amber-400 font-extrabold text-sm sm:text-base px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">ريسيل</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">سوق إعادة البيع العقاري في مصر</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-200">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              الرئيسية
            </Link>
            <Link href="/properties" className="hover:text-amber-400 transition-colors">
              وحدات الريسيل
            </Link>
            <Link href="/#areas" className="hover:text-amber-400 transition-colors">
              المناطق والكمبوندات
            </Link>
            <Link href="/admin" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs py-1 px-2.5 rounded-lg border border-slate-700/80 hover:border-slate-600">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              لوحة الإدارة
            </Link>
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sell"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-md shadow-amber-500/25 transition-all hover:scale-102 active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              اعرض وحدتك للبيع
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/sell"
              className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              اعرض وحدتك
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400"
          >
            الرئيسية
          </Link>
          <Link
            href="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400"
          >
            كل وحدات الريسيل
          </Link>
          <Link
            href="/#areas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400"
          >
            تصفح بالمناطق
          </Link>
          <Link
            href="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20"
          >
            اعرض وحدتك للبيع (ملاك فقط)
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white"
          >
            لوحة الإدارة (Admin)
          </Link>
        </div>
      )}
    </header>
  );
}
