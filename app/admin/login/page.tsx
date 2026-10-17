'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import Logo from '@/components/Logo';
import { Lock, Mail, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function AdminLoginPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (!isSupabaseConfigured) {
      // Mock login for demo purposes
      setTimeout(() => {
        setIsLoading(false);
        router.push('/admin');
      }, 500);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(lang === 'ar' ? `فشل تسجيل الدخول: ${error.message}` : `Login failed: ${error.message}`);
      } else if (data.session) {
        router.push('/admin');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : (lang === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoBypass = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6 relative">
        
        {/* Language Switcher in Corner */}
        <div className="absolute top-6 end-6">
          <LanguageSwitcher variant="navbar" />
        </div>

        {/* Brand */}
        <div className="text-center space-y-3 pt-2">
          <Link href="/" className="inline-block group">
            <Logo className="h-16 w-auto mx-auto rounded-2xl shadow-xl border border-white/10 group-hover:border-amber-500/40 transition-all" />
          </Link>
          <h2 className="text-2xl font-black text-white">
            {t('admin.login.title')}
          </h2>
          <p className="text-xs text-slate-400">
            {t('admin.login.subtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('admin.login.email')}</span>
            </label>
            <input
              type="email"
              required
              placeholder="admin@salino.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('admin.login.password')}</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-101 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? t('admin.common.loading') : t('admin.login.submit')}
          </button>
        </form>

        {/* Demo Fast Login Button */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-3">
          <button
            type="button"
            onClick={handleDemoBypass}
            className="w-full bg-slate-800/80 hover:bg-slate-800 text-amber-400 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{t('admin.login.demoBtn')}</span>
          </button>
          
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-block">
            {t('admin.login.backToSite')}
          </Link>
        </div>

      </div>
    </div>
  );
}
