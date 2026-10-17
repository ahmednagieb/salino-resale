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
