'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SalinoLogo } from '@/src/components/brand/SalinoLogo';
import {
  Button,
  SectionHeader,
  ServiceCard,
  ServiceCardSkeleton,
  InputField,
  SelectField,
  TextareaField,
} from '@/src/components/ui';
import {
  submitInquiry,
  getFeaturedProjects,
  FeaturedProject,
  SalinoSector,
  InquiryInsert,
} from '@/src/lib/supabase';
import {
  Truck,
  Boxes,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Menu,
  X,
  ArrowDown,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function SalinoCorporatePage() {
  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Projects filtering & loading state
  const [activeSectorFilter, setActiveSectorFilter] = useState<'all' | SalinoSector>('all');
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Quote form state
  const [formData, setFormData] = useState<InquiryInsert>({
    company_name: '',
    contact_name: '',
    phone: '',
    email: '',
    sector: 'transport',
    project_details: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedReference, setSubmittedReference] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const quoteFormRef = useRef<HTMLDivElement>(null);

  // Load featured projects
  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      setIsLoadingProjects(true);
      try {
        const data = await getFeaturedProjects(
          activeSectorFilter === 'all' ? undefined : activeSectorFilter
        );
        if (isMounted) {
          setProjects(data);
        }
      } catch {
        if (isMounted) {
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProjects(false);
        }
      }
    }

    loadProjects();
    return () => {
      isMounted = false;
    };
  }, [activeSectorFilter]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler when clicking sector card action: pre-select sector and scroll to quote form
  const handleSelectSector = (sector: SalinoSector) => {
    setFormData((prev) => ({ ...prev, sector }));
    if (quoteFormRef.current) {
      quoteFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Validate quote form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.company_name.trim()) {
      errors.company_name = 'يرجى إدخال اسم الشركة أو الجهة';
    }

    if (!formData.contact_name.trim()) {
      errors.contact_name = 'يرجى إدخال اسم المسؤول للتواصل';
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      errors.phone = 'يرجى إدخال رقم هاتف صحيح للتواصل';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'يرجى إدخال بريد إلكتروني صالح';
    }

    if (!formData.project_details.trim() || formData.project_details.length < 10) {
      errors.project_details = 'يرجى توضيح تفاصيل المشروع أو متطلبات التوريد (10 أحرف على الأقل)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit quote form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitInquiry(formData);
      if (result.success) {
        setSubmitSuccess(true);
        setSubmittedReference(result.id || `REQ-${Date.now().toString().slice(-6)}`);
        setFormData({
          company_name: '',
          contact_name: '',
          phone: '',
          email: '',
          sector: 'transport',
          project_details: '',
        });
        setFormErrors({});
      } else {
        setSubmitError(result.error || 'تعذر إرسال الطلب، يرجى المحاولة مرة أخرى.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-salino-obsidian text-salino-alabaster min-h-screen selection:bg-salino-copper selection:text-salino-alabaster font-ar flex flex-col relative overflow-hidden">
      
      {/* =========================================================================
          1. STICKY GLASSMORPHIC HEADER
         ========================================================================= */}
      <header className="sticky top-0 z-50 bg-salino-obsidian/90 backdrop-blur-xl border-b border-salino-copper/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center group transition-transform duration-300 hover:scale-102"
              aria-label="سالينو لإدارة المشروعات - الصفحة الرئيسية"
            >
              <SalinoLogo variant="navbar" className="h-10 sm:h-12 w-auto" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-salino-stone" aria-label="القائمة الرئيسية">
              <button
                type="button"
                onClick={() => scrollToSection('sectors')}
                className="hover:text-salino-copper transition-colors duration-200 cursor-pointer"
              >
                قطاعات الأعمال
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('projects')}
                className="hover:text-salino-copper transition-colors duration-200 cursor-pointer"
              >
                سجل المشروعات
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('advantages')}
                className="hover:text-salino-copper transition-colors duration-200 cursor-pointer"
              >
                المزايا التنافسية
              </button>
              <Link
                href="/properties"
                className="hover:text-salino-copper transition-colors duration-200 flex items-center gap-1.5"
              >
                <span>سوق الريسيل</span>
                <span className="text-[10px] bg-salino-copper-muted border border-salino-copper/40 text-salino-copper px-1.5 py-0.5 rounded-full font-en">
                  LIVE
                </span>
              </Link>
            </nav>

            {/* Quick Quote CTA Button */}
            <div className="hidden sm:flex items-center gap-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => scrollToSection('quote')}
                className="font-bold text-xs"
              >
                اطلب عرض سعر
              </Button>
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                className="p-2.5 rounded-xl bg-salino-surface border border-salino-copper/30 text-salino-alabaster hover:text-salino-copper transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-salino-surface border-b border-salino-copper/25 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-3 text-sm font-bold text-salino-stone">
              <button
                type="button"
                onClick={() => scrollToSection('sectors')}
                className="text-start py-2 hover:text-salino-copper transition-colors"
              >
                قطاعات الأعمال
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('projects')}
                className="text-start py-2 hover:text-salino-copper transition-colors"
              >
                سجل المشروعات
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('advantages')}
                className="text-start py-2 hover:text-salino-copper transition-colors"
              >
                المزايا التنافسية
              </button>
              <Link
                href="/properties"
                className="text-start py-2 hover:text-salino-copper transition-colors flex items-center justify-between"
              >
                <span>سوق الريسيل العقاري</span>
                <span className="text-[10px] bg-salino-copper-muted border border-salino-copper/40 text-salino-copper px-2 py-0.5 rounded-full font-en">
                  LIVE
                </span>
              </Link>
            </nav>

            <div className="pt-2 border-t border-salino-copper/20">
              <Button
                variant="primary"
                size="md"
                onClick={() => scrollToSection('quote')}
                className="w-full justify-center"
              >
                اطلب عرض سعر فوري
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION (#000000 Pitch Obsidian)
         ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden bg-salino-obsidian">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-salino-copper/10 rounded-full blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-7">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-salino-surface border border-salino-copper/40 shadow-copper-glow backdrop-blur-md">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-salino-copper opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-salino-copper"></span>
              </span>
              <span className="font-en text-xs font-bold tracking-subtitle text-salino-copper uppercase select-none">
                PROJECT MANAGEMENT
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-salino-alabaster font-ar tracking-tight leading-[1.25] sm:leading-[1.2]">
              ندير منظومة أعمالك من{' '}
              <span className="text-salino-copper inline-block relative">
                التوريد والنقل
              </span>{' '}
              حتى الاستثمار العقاري
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-salino-stone max-w-3xl mx-auto font-ar leading-relaxed">
              شريكك الاستراتيجي في مصر لتنفيذ وإدارة المشروعات الكبرى عبر ثلاثة قطاعات متكاملة:
              النقل الداخلي واللوجستيات الثقيلة، التوريدات العمومية لمواقع البناء، والتسويق والاستشارات العقارية الموثوقة.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('quote')}
                className="shadow-copper-glow hover:scale-102 transition-transform"
              >
                اطلب عرض سعر فوري
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => scrollToSection('sectors')}
                className="hover:scale-102 transition-transform"
              >
                استكشف قطاعاتنا
              </Button>
            </div>

          </div>

          {/* Hero Visual Showcase: Master Vector Logo + Operational KPIs */}
          <div className="mt-14 sm:mt-18 max-w-5xl mx-auto">
            <div className="bg-salino-charcoal/80 border border-salino-copper/40 rounded-salino p-6 sm:p-10 shadow-copper-glow backdrop-blur-md relative overflow-hidden">
              
              {/* Logo Presentation Frame */}
              <div className="flex items-center justify-center py-4 sm:py-8">
                <SalinoLogo variant="master" className="w-full max-w-2xl h-auto drop-shadow-2xl" />
              </div>

              {/* Live Operational KPIs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-6 border-t border-salino-copper/25 text-center">
                <div className="space-y-1">
                  <div className="font-en text-2xl sm:text-3xl font-black text-salino-copper">
                    +150
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-salino-alabaster font-ar">
                    مورد ومصنع معتمد
                  </div>
                  <div className="text-[11px] text-salino-stone font-ar">
                    شراكات توريد مباشرة
                  </div>
                </div>

                <div className="space-y-1 sm:border-x border-salino-copper/20">
                  <div className="font-en text-2xl sm:text-3xl font-black text-salino-copper">
                    99.4%
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-salino-alabaster font-ar">
                    دقة مواعيد النقل
                  </div>
                  <div className="text-[11px] text-salino-stone font-ar">
                    تتبع لوجستي مدار الساعة
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-en text-2xl sm:text-3xl font-black text-salino-copper">
                    +30
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-salino-alabaster font-ar">
                    مشروع واستشارة عقارية
                  </div>
                  <div className="text-[11px] text-salino-stone font-ar">
                    إدارة محافظ واستثمار
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. CORE SECTORS SECTION (#sectors)
         ========================================================================= */}
      <section id="sectors" className="py-20 sm:py-28 bg-salino-charcoal relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <SectionHeader
            badge="SECTORS // 03 CORE PILLARS"
            title="قطاعات الأعمال والتشغيل المتكاملة"
            description="نقدم حلولاً مؤسسية شاملة ترتكز على التكامل بين النقل الثقيل، سلاسل الإمداد والتوريدات الإنشائية، والحلول العقارية الاستثمارية."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Sector 1: Transport */}
            <ServiceCard
              sectorCode="01 // INTERNAL TRANSPORT"
              title="النقل الداخلي والحلول اللوجستية"
              description="أسطول نقل ثقيل وتريلات مجهزة لربط الموانئ المصرية والمناطق اللوجستية بمواقع المشروعات الإنشائية الكبرى، مدعوماً بأنظمة تتبع رقمية 24/7."
              metrics={[
                { value: "+45", label: "شاحنة ومعدة نقل" },
                { value: "24/7", label: "مراقبة مسار حية" },
              ]}
              icon={<Truck className="w-5 h-5" />}
              actionLabel="طلب تسعير نقل داخلي"
              onAction={() => handleSelectSector('transport')}
            />

            {/* Sector 2: Supplies */}
            <ServiceCard
              sectorCode="02 // GENERAL SUPPLIES"
              title="التوريدات العمومية للمشاريع"
              description="توريد خامات البناء الأساسية، حديد التسليح، الأسمنت، العزل، والمعدات الكهروميكانيكية والتشطيبات بشراكات مباشرة مع المصانع المعتمدة."
              metrics={[
                { value: "+150", label: "مصنع وشريك توريد" },
                { value: "100%", label: "مطابقة للمواصفات" },
              ]}
              icon={<Boxes className="w-5 h-5" />}
              actionLabel="طلب توريدات إنشائية"
              onAction={() => handleSelectSector('supplies')}
            />

            {/* Sector 3: Real Estate */}
            <ServiceCard
              sectorCode="03 // REAL ESTATE MARKETING"
              title="التسويق والاستشارات العقارية"
              description="إدارة وتسويق المحافظ العقارية والصفقات السكنية والتجارية الحصرية وإعادة البيع (ريسيل) بأعلى عائد استثماري وبدراسات مالية معتمدة."
              metrics={[
                { value: "+30", label: "مشروع ومحفظة مدارة" },
                { value: "+2.8B", label: "قيمة التداولات ج.م" },
              ]}
              icon={<Building2 className="w-5 h-5" />}
              actionLabel="طلب استشارة عقارية"
              onAction={() => handleSelectSector('real_estate')}
            />

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. FEATURED PROJECTS & OPERATIONS FILTERABLE GRID (#projects)
         ========================================================================= */}
      <section id="projects" className="py-20 sm:py-28 bg-salino-obsidian relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <SectionHeader
            badge="TRACK RECORD // LANDMARKS"
            title="سجل المشروعات والعمليات المنفذة"
            description="نعتز بثقة كبرى الشركات والهيئات والمطورين في مشاريعنا المنفذة في العاصمة الإدارية، القاهرة الجديدة، أكتوبر، والعين السخنة."
            align="center"
          />

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {[
              { id: 'all', label: 'كافة المشروعات' },
              { id: 'transport', label: 'النقل الداخلي واللوجستيات' },
              { id: 'supplies', label: 'التوريدات العمومية' },
              { id: 'real_estate', label: 'التسويق والاستثمار العقاري' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSectorFilter(tab.id as 'all' | SalinoSector)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeSectorFilter === tab.id
                    ? 'bg-salino-copper text-salino-alabaster shadow-copper-glow border border-salino-copper'
                    : 'bg-salino-surface text-salino-stone hover:text-salino-alabaster border border-salino-copper/25 hover:border-salino-copper/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Projects Grid Container */}
          <div>
            {isLoadingProjects ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ServiceCardSkeleton />
                <ServiceCardSkeleton />
                <ServiceCardSkeleton />
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-salino-surface border border-salino-copper/30 hover:border-salino-copper rounded-salino p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-copper-glow hover:-translate-y-1"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-en font-bold tracking-subtitle text-salino-copper uppercase">
                          {project.sector === 'transport'
                            ? 'TRANSPORT'
                            : project.sector === 'supplies'
                            ? 'SUPPLIES'
                            : 'REAL ESTATE'}
                        </span>
                        <div className="flex items-center gap-1 text-salino-stone text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-salino-copper shrink-0" />
                          <span>{project.location_ar}</span>
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-base sm:text-lg font-bold text-salino-alabaster font-ar leading-snug">
                        {project.title_ar}
                      </h3>
                    </div>

                    {/* Project KPI Highlight */}
                    <div className="pt-4 border-t border-salino-copper/20 flex items-center justify-between">
                      <div className="text-xs text-salino-stone font-ar">
                        {project.metric_label_ar}:
                      </div>
                      <div className="font-en text-sm sm:text-base font-black text-salino-copper">
                        {project.metric_value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-salino-surface border border-salino-copper/20 rounded-salino p-8 max-w-md mx-auto space-y-4">
                <AlertCircle className="w-10 h-10 text-salino-copper mx-auto" />
                <h4 className="text-base font-bold text-salino-alabaster">
                  لا توجد مشاريع مسجلة في هذا القطاع حالياً
                </h4>
                <p className="text-xs text-salino-stone">
                  يمكنك استعراض المشروعات الأخرى أو التواصل معنا للحصول على ملف المشروعات الكامل.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveSectorFilter('all')}
                >
                  عرض كافة المشروعات
                </Button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. COMPETITIVE ADVANTAGES SECTION (#advantages)
         ========================================================================= */}
      <section id="advantages" className="py-20 sm:py-28 bg-salino-charcoal relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <SectionHeader
            badge="VALUE PROPOSITION // ADVANTAGES"
            title="لماذا تختار سالينو لإدارة المشروعات؟"
            description="نمنح شركاءنا ميزة تنافسية حقيقية عبر دمج العمليات اللوجستية والتوريدات في عقد تشغيلي موحد عالي الكفاءة."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-salino-surface border border-salino-copper/25 rounded-salino p-6 space-y-3.5 hover:border-salino-copper transition-colors">
              <div className="w-12 h-12 rounded-xl bg-salino-copper-muted border border-salino-copper/30 flex items-center justify-center text-salino-copper">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-salino-alabaster">
                عقد إدارة موحد
              </h3>
              <p className="text-xs sm:text-sm text-salino-stone leading-relaxed">
                تقليص الأعباء الإدارية والتكاليف التشغيلية بنسبة تصل إلى 28% عبر إدارة النقل والتوريد بجهة تنفيذية واحدة.
              </p>
            </div>

            <div className="bg-salino-surface border border-salino-copper/25 rounded-salino p-6 space-y-3.5 hover:border-salino-copper transition-colors">
              <div className="w-12 h-12 rounded-xl bg-salino-copper-muted border border-salino-copper/30 flex items-center justify-center text-salino-copper">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-salino-alabaster">
                التزام زمني حازم
              </h3>
              <p className="text-xs sm:text-sm text-salino-stone leading-relaxed">
                غرامات تأخير صفرية وجداول تسليم دقيقة تضمن استمرار العمل في مواقع المشروعات دون أي توقف أو تعطيل.
              </p>
            </div>

            <div className="bg-salino-surface border border-salino-copper/25 rounded-salino p-6 space-y-3.5 hover:border-salino-copper transition-colors">
              <div className="w-12 h-12 rounded-xl bg-salino-copper-muted border border-salino-copper/30 flex items-center justify-center text-salino-copper">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-salino-alabaster">
                أسعار مصانع مباشرة
              </h3>
              <p className="text-xs sm:text-sm text-salino-stone leading-relaxed">
                شراكات استراتيجية طويلة الأجل مع أكبر مصانع الحديد، الأسمنت، والتشطيبات في مصر تضمن لك أفضل تسعير.
              </p>
            </div>

            <div className="bg-salino-surface border border-salino-copper/25 rounded-salino p-6 space-y-3.5 hover:border-salino-copper transition-colors">
              <div className="w-12 h-12 rounded-xl bg-salino-copper-muted border border-salino-copper/30 flex items-center justify-center text-salino-copper">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-salino-alabaster">
                خبرة عقارية متعمقة
              </h3>
              <p className="text-xs sm:text-sm text-salino-stone leading-relaxed">
                رؤية تحليلية دقيقة لسوق الريسيل والمشروعات الكبرى، تساعدك على استثمار أصولك بأعلى عائد رأسمالي ممكن.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          6. INTERACTIVE QUOTE & CONSULTATION FORM (#quote)
         ========================================================================= */}
      <section id="quote" ref={quoteFormRef} className="py-20 sm:py-28 bg-salino-obsidian relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <SectionHeader
            badge="INQUIRIES // GET A QUOTE"
            title="اطلب عرض سعر أو استشارة لمشروعك"
            description="املأ بيانات مشروعك وسيقوم فريق العمليات واللوجستيات بالتواصل معك خلال 24 ساعة بجدول زمني وعرض أسعار تفصيلي."
            align="center"
          />

          <div className="bg-salino-surface border border-salino-copper/40 rounded-salino p-6 sm:p-10 shadow-copper-glow backdrop-blur-md">
            
            {submitSuccess ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-salino-copper-muted border border-salino-copper text-salino-copper flex items-center justify-center mx-auto shadow-copper-glow">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-salino-alabaster">
                    تم استلام طلبكم بنجاح!
                  </h3>
                  <p className="text-sm text-salino-stone max-w-md mx-auto">
                    شكراً لتواصلكم مع سالينو لإدارة المشروعات. تم تسجيل طلبكم برقم مرجعي:
                  </p>
                  <div className="inline-block px-4 py-1.5 rounded-xl bg-salino-charcoal border border-salino-copper/40 font-en font-bold text-salino-copper text-base tracking-wider mt-2">
                    {submittedReference}
                  </div>
                </div>

                <p className="text-xs text-salino-stone">
                  سيقوم مسؤول قطاع العمليات بالتواصل معكم هاتفياً أو عبر البريد الإلكتروني لمناقشة التفاصيل الفنية.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setSubmitSuccess(false);
                      setSubmittedReference('');
                    }}
                  >
                    تقديم طلب آخر
                  </Button>

                  <a
                    href={`https://wa.me/201000000000?text=${encodeURIComponent(
                      `مرحباً سالينو لإدارة المشروعات، قمت بتقديم طلب تسعير برقم مرجعي (${submittedReference}) وأود الاستفسار عن المتابعة.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>متابعة سريعة عبر واتساب</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                
                {submitError && (
                  <div
                    role="alert"
                    className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="اسم الشركة / المؤسسة"
                    placeholder="مثال: شركة المقاولات الحديثة"
                    required
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    error={formErrors.company_name}
                  />

                  <InputField
                    label="اسم المسؤول للتواصل"
                    placeholder="مثال: م. أحمد عبد العزيز"
                    required
                    value={formData.contact_name}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_name: e.target.value })
                    }
                    error={formErrors.contact_name}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="رقم الهاتف للتواصل"
                    type="tel"
                    placeholder="010XXXXXXXX"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    error={formErrors.phone}
                    helperText="سنستخدم هذا الرقم للتواصل ومشاركة عرض الأسعار"
                  />

                  <InputField
                    label="البريد الإلكتروني (اختياري)"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    error={formErrors.email}
                  />
                </div>

                <SelectField
                  label="القطاع المطلوب"
                  required
                  value={formData.sector}
                  onChange={(e) =>
                    setFormData({ ...formData, sector: e.target.value as SalinoSector })
                  }
                  options={[
                    { value: 'transport', label: 'النقل الداخلي والحلول اللوجستية (أسطول وتريلات)' },
                    { value: 'supplies', label: 'التوريدات العمومية (حديد، أسمنت، خامات بناء، تشطيبات)' },
                    { value: 'real_estate', label: 'التسويق والاستشارات العقارية (ريسيل ومحافظ استثمارية)' },
                  ]}
                />

                <TextareaField
                  label="تفاصيل المشروع ومتطلبات التوريد / النقل"
                  placeholder="يرجى ذكر حجم الأعمال، الموقع الجغرافي، كميات التوريد أو مسار النقل المطلوب، والجدول الزمني المخطط..."
                  required
                  rows={4}
                  value={formData.project_details}
                  onChange={(e) =>
                    setFormData({ ...formData, project_details: e.target.value })
                  }
                  error={formErrors.project_details}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full text-sm font-bold shadow-copper-glow"
                >
                  إرسال طلب عرض السعر
                </Button>

                <p className="text-[11px] text-center text-salino-stone font-ar">
                  جميع بياناتك تخضع لسياسة الخصوصية وسرية المشروعات الخاصة بسالينو لإدارة المشروعات.
                </p>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* =========================================================================
          7. CORPORATE FOOTER
         ========================================================================= */}
      <footer className="bg-salino-charcoal border-t border-salino-copper/25 text-salino-stone pt-16 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            
            {/* Col 1: Brand Info & Vector Logo */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <SalinoLogo variant="mark" className="w-10 h-10" />
                <SalinoLogo variant="navbar" className="h-8 w-auto" />
              </div>
              <p className="text-xs text-salino-stone leading-relaxed font-ar">
                سالينو لإدارة المشروعات (Salino Project Management) — شريكك المتكامل لحلول النقل الداخلي، التوريدات العمومية، والاستشارات العقارية في جمهورية مصر العربية.
              </p>
            </div>

            {/* Col 2: Business Sectors */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-salino-copper font-en tracking-subtitle uppercase">
                BUSINESS SECTORS
              </h4>
              <ul className="space-y-2 text-xs font-ar font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => handleSelectSector('transport')}
                    className="hover:text-salino-copper transition-colors cursor-pointer"
                  >
                    النقل الداخلي واللوجستيات
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleSelectSector('supplies')}
                    className="hover:text-salino-copper transition-colors cursor-pointer"
                  >
                    التوريدات العمومية للمشروعات
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleSelectSector('real_estate')}
                    className="hover:text-salino-copper transition-colors cursor-pointer"
                  >
                    التسويق والاستشارات العقارية
                  </button>
                </li>
                <li>
                  <Link href="/properties" className="hover:text-salino-copper transition-colors">
                    محفظة عقارات الريسيل
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Quick Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-salino-copper font-en tracking-subtitle uppercase">
                QUICK ACCESS
              </h4>
              <ul className="space-y-2 text-xs font-ar font-medium">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('sectors')}
                    className="hover:text-salino-copper transition-colors cursor-pointer"
                  >
                    القطاعات الرئيسية
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('projects')}
                    className="hover:text-salino-copper transition-colors cursor-pointer"
                  >
                    سجل المشروعات
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('advantages')}
                    className="hover:text-salino-copper transition-colors cursor-pointer"
                  >
                    المزايا التنافسية
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('quote')}
                    className="hover:text-salino-copper transition-colors cursor-pointer"
                  >
                    طلب عرض سعر
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Corporate Contacts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-salino-copper font-en tracking-subtitle uppercase">
                CONTACT CHANNELS
              </h4>
              <div className="space-y-2.5 text-xs font-ar">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-salino-copper shrink-0" />
                  <span dir="ltr" className="font-en text-salino-alabaster font-bold">+20 100 000 0000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-salino-copper shrink-0" />
                  <span className="font-en text-salino-alabaster">contact@salino-eg.com</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-salino-copper shrink-0 mt-0.5" />
                  <span>القاهرة الجديدة - التجمع الخامس، مصر</span>
                </div>
                <div className="pt-2">
                  <a
                    href="https://wa.me/201000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-salino-surface border border-salino-copper/35 hover:border-salino-copper text-salino-alabaster text-[11px] font-bold transition-all hover:scale-102"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>تواصل مباشر واتساب</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Legal */}
          <div className="pt-8 border-t border-salino-copper/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p className="font-ar text-center sm:text-start">
              جميع الحقوق محفوظة © {new Date().getFullYear()} سالينو لإدارة المشروعات (Salino Project Management).
            </p>
            <p className="font-en tracking-wider text-salino-stone/70 text-[11px]">
              INTEGRATED LOGISTICS • GENERAL SUPPLIES • REAL ESTATE
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
