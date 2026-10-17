'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
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
        setErrorMsg(`فشل تسجيل الدخول: ${error.message}`);
      } else if (data.session) {
        router.push('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoBypass = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold mx-auto shadow-lg shadow-amber-500/20">
            <Building2 className="w-7 h-7 text-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white">
            تسجيل دخول لوحة الإدارة
          </h2>
          <p className="text-xs text-slate-400">
            بوابة المشرفين لإدارة وحدات الريسيل وطلبات الملاك
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
              البريد الإلكتروني
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
              كلمة المرور
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
            {isLoading ? 'جاري التحقق...' : 'دخول إلى لوحة التحكم'}
          </button>
        </form>

        {/* Demo Fast Login Button */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-3">
          <button
            type="button"
            onClick={handleDemoBypass}
            className="w-full bg-slate-800/80 hover:bg-slate-800 text-amber-400 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>دخول سريع للمعاينة (Demo Mode)</span>
          </button>
          
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-block">
            العودة للموقع العام
          </Link>
        </div>

      </div>
    </div>
  );
}
