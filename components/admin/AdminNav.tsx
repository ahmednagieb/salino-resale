'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  Home, 
  Inbox, 
  MapPin, 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'نظرة عامة', href: '/admin', icon: Home },
    { label: 'إدارة وحدات الريسيل', href: '/admin/properties', icon: Building2 },
    { label: 'صندوق طلبات الملاك', href: '/admin/submissions', icon: Inbox },
    { label: 'الكمبوندات والمناطق', href: '/admin/compounds', icon: MapPin },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Badge */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 font-black text-lg text-white">
              <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
                S
              </span>
              <span>لوحة تحكم سالينو</span>
            </Link>

            {/* Supabase Status Pill */}
            <div className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
              isSupabaseConfigured
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
            }`}>
              {isSupabaseConfigured ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>متصل بقاعدة Supabase</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>وضع المعاينة (Demo Mode)</span>
                </>
              )}
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Public Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
            >
              <span>الموقع العام</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2 overflow-x-auto border-t border-slate-800/80 gap-2 scrollbar-none text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap font-bold ${
                  isActive
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
