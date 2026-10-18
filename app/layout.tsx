import type { Metadata } from 'next';
import { Readex_Pro, Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';

const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-readex',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'سالينو لإدارة المشروعات | Salino Project Management',
  description: 'إدارة متكاملة لمنظومة الأعمال في مصر: النقل الداخلي والحلول اللوجستية، التوريدات العمومية للمشروعات، والتسويق والاستشارات العقارية. Integrated Management for Transport, Supplies & Real Estate.',
  keywords: [
    'سالينو لإدارة المشروعات',
    'Salino Project Management',
    'نقل داخلي مصر',
    'لوجستيات ونقل ثقيل',
    'توريدات عمومية للمشاريع',
    'توريد مواد بناء وحديد وأسمنت',
    'تسويق عقاري واستشارات',
    'عقارات العاصمة الإدارية والتجمع',
  ],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${readexPro.variable} ${montserrat.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-salino-obsidian text-salino-alabaster font-ar antialiased selection:bg-salino-copper selection:text-salino-alabaster">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
