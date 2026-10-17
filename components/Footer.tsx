'use client';

import Link from 'next/link';
import { Building2, MessageCircle, Phone, MapPin, ShieldCheck, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-xl font-black text-white">
                سالينو <span className="text-amber-400">ريسيل</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              المنصة المتخصصة الأولى في مصر لصفقات إعادة البيع العقاري (الريسيل) مباشرة من الملاك في كبرى كمبوندات التجمع الخامس، زايد، ومستقبل سيتي بأفضل أوفر وأدق حسابات للأقساط.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-amber-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>معاينة وتدقيق عقود المطورين</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base border-r-2 border-amber-500 pr-2">
              روابط سريعة
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/properties" className="hover:text-amber-400 transition-colors">
                  أحدث وحدات الريسيل
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-amber-400 transition-colors">
                  اعرض وحدتك للبيع مجاناً
                </Link>
              </li>
              <li>
                <Link href="/properties?deliveryStatus=استلام+فوري" className="hover:text-amber-400 transition-colors">
                  وحدات استلام فوري
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">
                  بوابة إدارة المنصة
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Resale Areas */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base border-r-2 border-amber-500 pr-2">
              أشهر مناطق الريسيل
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/properties?area=التجمع+الخامس" className="hover:text-amber-400 transition-colors">
                  كمبوندات التجمع الخامس (القاهرة الجديدة)
                </Link>
              </li>
              <li>
                <Link href="/properties?area=الشيخ+زايد" className="hover:text-amber-400 transition-colors">
                  كمبوندات الشيخ زايد و 6 أكتوبر
                </Link>
              </li>
              <li>
                <Link href="/properties?area=مستقبل+سيتي" className="hover:text-amber-400 transition-colors">
                  ريسيل مدينة المستقبل (Mostakbal City)
                </Link>
              </li>
              <li>
                <Link href="/properties?area=الساحل+الشمالي" className="hover:text-amber-400 transition-colors">
                  ريسيل الساحل الشمالي وسيدي عبد الرحمن
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base border-r-2 border-amber-500 pr-2">
              تواصل ومساعدة المبيعات
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              فريق مستشاري الريسيل جاهز لمساعدتك في حساب متبقي الأقساط ومصاريف التنازل في الشركة.
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>محادثة واتساب مباشرة: 01000000000</span>
              </a>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>يومياً من 10:00 صباحاً حتى 10:00 مساءً</span>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            جميع الحقوق محفوظة © 2025 سالينو ريسيل مصر.
          </p>
          <p className="text-[11px] text-slate-400 max-w-xl text-center md:text-left">
            * تنويه: أرقام المدفوع والأوفر برايس ومصاريف التنازل يتم التحقق منها استناداً إلى عقود المطور الرسمية وكشوف الحساب الصادرة من إدارات الحسابات.
          </p>
        </div>
      </div>
    </footer>
  );
}
