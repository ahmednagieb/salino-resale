import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'سالينو ريسيل | المنصة الأولى لعقارات الريسيل في مصر | Salino Resale Egypt',
  description: 'أفضل صفقات ووحدات إعادة البيع (ريسيل) في التجمع الخامس، زايد، مستقبل سيتي، والعاصمة الإدارية. حسابات دقيقة للمطلوب كاش، الأوفر برايس، ومتبقي الأقساط. Egypt #1 Resale Real Estate Marketplace.',
  keywords: [
    'ريسيل مصر',
    'شقق ريسيل التجمع الخامس',
    'ريسيل مستقبل سيتي',
    'ريسيل الشيخ زايد',
    'أوفر برايس',
    'ماونتن فيو ريسيل',
    'بالم هيلز ريسيل',
    'ميفيدا ريسيل',
    'Egypt Resale Properties',
    'New Cairo Resale',
    'Sheikh Zayed Resale',
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
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${cairo.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-white">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
