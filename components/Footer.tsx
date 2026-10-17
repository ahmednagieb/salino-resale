'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Building2, MessageCircle, ShieldCheck, Clock } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

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
                {t('nav.brand')} <span className="text-amber-400">{t('nav.resale')}</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-amber-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('footer.verifiedContracts')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base border-s-2 border-amber-500 ps-2">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/properties" className="hover:text-amber-400 transition-colors">
                  {t('footer.latestResale')}
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-amber-400 transition-colors">
                  {t('footer.sellFree')}
                </Link>
              </li>
              <li>
                <Link href="/properties?deliveryStatus=استلام+فوري" className="hover:text-amber-400 transition-colors">
                  {t('footer.readyDelivery')}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">
                  {t('footer.adminPortal')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Resale Areas */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base border-s-2 border-amber-500 ps-2">
              {t('footer.topAreas')}
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/properties?area=التجمع+الخامس" className="hover:text-amber-400 transition-colors">
                  {t('footer.newCairo')}
                </Link>
              </li>
              <li>
                <Link href="/properties?area=الشيخ+زايد" className="hover:text-amber-400 transition-colors">
                  {t('footer.sheikhZayed')}
                </Link>
              </li>
              <li>
                <Link href="/properties?area=مستقبل+سيتي" className="hover:text-amber-400 transition-colors">
                  {t('footer.mostakbal')}
                </Link>
              </li>
              <li>
                <Link href="/properties?area=الساحل+الشمالي" className="hover:text-amber-400 transition-colors">
                  {t('footer.northCoast')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base border-s-2 border-amber-500 ps-2">
              {t('footer.salesContact')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer.salesDesc')}
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="https://wa.me/201000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('footer.whatsappChat')}</span>
              </a>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('footer.workHours')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p>{t('footer.rights')}</p>
            <LanguageSwitcher variant="footer" />
          </div>
          <p className="text-[11px] text-slate-400 max-w-xl text-center md:text-start">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
