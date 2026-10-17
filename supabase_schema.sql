-- ==============================================================================
-- SALINO RESALE EGYPT - SUPABASE DATABASE SCHEMA & INITIAL SEED
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. COMPOUNDS TABLE
create table if not exists public.compounds (
    id uuid primary key default gen_random_uuid(),
    name_ar text not null,
    name_en text not null,
    area_name text not null, -- e.g. التجمع الخامس، الشيخ زايد، مستقبل سيتي
    developer_name text not null,
    created_at timestamptz default now()
);

-- 3. RESALE PROPERTIES TABLE
create table if not exists public.resale_properties (
    id uuid primary key default gen_random_uuid(),
    reference_code text unique not null, -- e.g. RES-101
    title_ar text not null,
    description_ar text,
    compound_id uuid references public.compounds(id) on delete set null,
    
    -- Specifications
    property_type text not null default 'شقة',
    area_sqm numeric not null default 0,
    bedrooms int not null default 1,
    bathrooms int not null default 1,
    floor_number int not null default 1,
    finishing_type text not null default 'نصف تشطيب',
    delivery_status text not null default 'استلام فوري',
    delivery_date date,

    -- Crucial Resale Financials
    original_price numeric not null default 0,
    paid_amount numeric not null default 0,
    over_price numeric not null default 0,
    total_down_payment numeric generated always as (paid_amount + over_price) stored,
    remaining_installments numeric not null default 0,
    total_price numeric generated always as (paid_amount + over_price + remaining_installments) stored,
    installment_years_left numeric not null default 0,
    maintenance_fee numeric not null default 0,
    transfer_fee numeric not null default 0,

    -- Media & Status
    images text[] default array[]::text[],
    video_url text,
    is_featured boolean default false,
    status text not null default 'available', -- 'available', 'sold', 'pending'
    created_at timestamptz default now()
);

-- 4. SELLER SUBMISSIONS TABLE
create table if not exists public.seller_submissions (
    id uuid primary key default gen_random_uuid(),
    owner_name text not null,
    owner_phone text not null,
    compound_name text not null,
    property_type text default 'شقة',
    area_sqm numeric default 0,
    paid_amount numeric not null default 0,
    over_price numeric not null default 0,
    remaining_amount numeric default 0,
    notes text,
    status text not null default 'new', -- 'new', 'contacted', 'listed', 'rejected'
    created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

alter table public.compounds enable row level security;
alter table public.resale_properties enable row level security;
alter table public.seller_submissions enable row level security;

-- Compounds: Everyone can view
create policy "Allow public read on compounds"
on public.compounds for select
to public
using (true);

-- Compounds: Authenticated users can insert/update/delete
create policy "Allow authenticated admin full access on compounds"
on public.compounds for all
to authenticated
using (true)
with check (true);

-- Resale Properties: Public can view available and sold properties
create policy "Allow public read on resale_properties"
on public.resale_properties for select
to public
using (true);

-- Resale Properties: Authenticated users can manage
create policy "Allow authenticated admin full access on resale_properties"
on public.resale_properties for all
to authenticated
using (true)
with check (true);

-- Seller Submissions: Public can insert their unit
create policy "Allow public insert on seller_submissions"
on public.seller_submissions for insert
to public
with check (true);

-- Seller Submissions: Authenticated admin can view and update
create policy "Allow authenticated admin full access on seller_submissions"
on public.seller_submissions for all
to authenticated
using (true)
with check (true);

-- ------------------------------------------------------------------------------
-- SUPABASE STORAGE BUCKET CONFIGURATION (property-images)
-- ------------------------------------------------------------------------------

-- Insert bucket if not exists
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'property-images',
    'property-images',
    true,
    5242880, -- 5MB limit (our client utility compresses to <150KB WebP)
    array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update set public = true;

-- Storage Policy: Public Read
create policy "Public can view property images"
on storage.objects for select
to public
using (bucket_id = 'property-images');

-- Storage Policy: Authenticated / Anon can upload compressed images
create policy "Allow upload to property-images"
on storage.objects for insert
to public
with check (bucket_id = 'property-images');

-- Storage Policy: Delete secondary images
create policy "Allow delete from property-images"
on storage.objects for delete
to public
using (bucket_id = 'property-images');

-- ------------------------------------------------------------------------------
-- INITIAL SEED DATA FOR EGYPT RESALE COMPOUNDS
-- ------------------------------------------------------------------------------

insert into public.compounds (id, name_ar, name_en, area_name, developer_name)
values
    ('a0000000-0000-0000-0000-000000000001', 'ميفيدا (Mivida)', 'Mivida', 'التجمع الخامس', 'إعمار مصر (Emaar)'),
    ('a0000000-0000-0000-0000-000000000002', 'بالم هيلز نيو كايرو', 'Palm Hills New Cairo', 'التجمع الخامس', 'بالم هيلز للتعمير'),
    ('a0000000-0000-0000-0000-000000000003', 'ماونتن فيو آي سيتي', 'Mountain View iCity', 'التجمع الخامس', 'ماونتن فيو (DMG)'),
    ('a0000000-0000-0000-0000-000000000004', 'بلوم فيلدز (Bloomfields)', 'Bloomfields', 'مستقبل سيتي', 'تطوير مصر (Tatweer Misr)'),
    ('a0000000-0000-0000-0000-000000000005', 'إل بوسكو سيتي', 'Il Bosco City', 'مستقبل سيتي', 'مصر إيطاليا'),
    ('a0000000-0000-0000-0000-000000000006', 'زد الشيخ زايد (Zed Towers)', 'Zed Sheikh Zayed', 'الشيخ زايد', 'أورا ديفلوبرز (ORA)'),
    ('a0000000-0000-0000-0000-000000000007', 'أليجريا (Allegria)', 'Allegria', 'الشيخ زايد', 'سوديك (SODIC)'),
    ('a0000000-0000-0000-0000-000000000008', 'بادية (Badya)', 'Badya Palm Hills', '6 أكتوبر', 'بالم هيلز للتعمير'),
    ('a0000000-0000-0000-0000-000000000009', 'سيليا (Celia)', 'Celia', 'العاصمة الإدارية', 'مجموعة طلعت مصطفى (TMG)'),
    ('a0000000-0000-0000-0000-000000000010', 'مراسي (Marassi)', 'Marassi', 'الساحل الشمالي', 'إعمار مصر (Emaar)')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- INITIAL SEED DATA FOR RESALE PROPERTIES
-- ------------------------------------------------------------------------------

insert into public.resale_properties (
    id, reference_code, title_ar, description_ar, compound_id, property_type,
    area_sqm, bedrooms, bathrooms, floor_number, finishing_type, delivery_status,
    delivery_date, original_price, paid_amount, over_price, remaining_installments,
    installment_years_left, maintenance_fee, transfer_fee, images, is_featured, status
) values
(
    'b0000000-0000-0000-0000-000000000001', 'RES-101',
    'شقة ريسيل بحري فيو لاندسكيب مفتوح في ميفيدا التجمع الخامس',
    'فرصة ريسيل استثنائية في كمبوند ميفيدا التجمع الخامس من إعمار مصر. الوحدة فيو مفتوح على المساحات الخضراء، تشطيب سوبر لوكس بالتكييفات والمطبخ. تم سداد نسبة كبيرة من الأقساط بموقع مميز للغاية بالقرب من الكلوب هاوس والمدرسة الدولية.',
    'a0000000-0000-0000-0000-000000000001', 'شقة',
    195, 3, 3, 3, 'ألترا سوبر لوكس', 'استلام فوري', '2025-01-01',
    11500000, 8200000, 1300000, 3300000, 2.5, 650000, 150000,
    array[
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    true, 'available'
),
(
    'b0000000-0000-0000-0000-000000000002', 'RES-102',
    'آي فيلا جاردن ريسيل في ماونتن فيو آي سيتي التجمع الخامس',
    'آي فيلا جاردن مميزة بحديقة خاصة 75 متر في ماونتن فيو آي سيتي القاهرة الجديدة. موقع مميز في الـ Lagoon مرحلة متقدمة. مدفوع أقساط منتظمة وأقل أوفر برايس في السوق.',
    'a0000000-0000-0000-0000-000000000003', 'دوبلكس',
    235, 4, 4, 1, 'نصف تشطيب', 'استلام 2026', '2026-09-01',
    9200000, 3800000, 850000, 5400000, 4.5, 520000, 100000,
    array[
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80'
    ],
    true, 'available'
),
(
    'b0000000-0000-0000-0000-000000000003', 'RES-103',
    'تاون هاوس كورنر استلام قريب في بالم هيلز نيو كايرو',
    'تاون هاوس كورنر ريسيل بمساحة أرض 310 متر ومباني 245 متر في أرقى مشروعات التجمع الخامس بالم هيلز نيو كايرو. أقساط متساوية ومريحة حتى 2029 بدون أي فوائد إضافية.',
    'a0000000-0000-0000-0000-000000000002', 'تاون هاوس',
    245, 4, 4, 1, 'نصف تشطيب', 'استلام خلال سنة', '2025-12-01',
    17500000, 7200000, 1900000, 10300000, 4, 900000, 250000,
    array[
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1200&q=80'
    ],
    true, 'available'
),
(
    'b0000000-0000-0000-0000-000000000004', 'RES-104',
    'شقة أرضي بجاردن خاصة في بلوم فيلدز مستقبل سيتي بأقل مقدم',
    'شقة للبيع ريسيل في كمبوند بلوم فيلدز تطوير مصر بمدينة المستقبل. مساحة 155 متر + حديقة خاصة 60 متر. فرصة ممتازة للمستثمرين وأصحاب العائلات بمقدم حنين وأقساط حتى 2030.',
    'a0000000-0000-0000-0000-000000000004', 'شقة',
    155, 3, 2, 1, 'تشطيب كامل', 'استلام 2026', '2026-06-01',
    6800000, 2100000, 450000, 4700000, 5, 380000, 80000,
    array[
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
    ],
    false, 'available'
),
(
    'b0000000-0000-0000-0000-000000000005', 'RES-105',
    'بنتهاوس فاخر في أبراج زد الشيخ زايد فيو حديقة زد بارك',
    'بنتهاوس خيالي بروف خاص 110م يطل مباشرة على Zed Park بأبراج ساويرس بالشيخ زايد. تشطيب كامل بالتكييفات وخزائن المطبخ من الشركة. استلام قريب جداً.',
    'a0000000-0000-0000-0000-000000000006', 'بنتهاوس',
    260, 4, 4, 18, 'ألترا سوبر لوكس', 'استلام خلال 6 أشهر', '2025-08-01',
    24000000, 16500000, 2200000, 7500000, 2, 1400000, 350000,
    array[
        'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
    ],
    true, 'available'
),
(
    'b0000000-0000-0000-0000-000000000006', 'RES-106',
    'شاليه أرضي صف أول بحيرة في مراسي الساحل الشمالي',
    'ريسيل لقطة في مراسي سيدي عبد الرحمن. تشطيب كامل فاخر ومفروش بالكامل، استلام فوري وقريب من الشاطئ والكلوب هاوس. أعلى عائد إيجاري بالدولار في الساحل.',
    'a0000000-0000-0000-0000-000000000010', 'شاليه',
    140, 2, 2, 1, 'ألترا سوبر لوكس', 'استلام فوري', '2024-06-01',
    18000000, 18000000, 3500000, 0, 0, 900000, 250000,
    array[
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
    ],
    true, 'sold'
)
on conflict (id) do nothing;
