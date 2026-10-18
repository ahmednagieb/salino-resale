-- ==============================================================================
-- Migration: 001_salino_schema.sql
-- Brand: Salino Project Management (سالينو لإدارة المشروعات)
-- Sectors: Internal Transport, General Supplies, Real Estate Marketing
-- ==============================================================================

-- 1. Create Enum for Salino Business Sectors
DO $$ BEGIN
    CREATE TYPE salino_sector AS ENUM ('transport', 'supplies', 'real_estate');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Service Inquiries Table (Quote & Consultation Requests)
CREATE TABLE IF NOT EXISTS service_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    sector salino_sector NOT NULL,
    project_details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) for inquiries
ALTER TABLE service_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists and create anonymous insert policy
DROP POLICY IF EXISTS "Allow anonymous insert for inquiries" ON service_inquiries;
CREATE POLICY "Allow anonymous insert for inquiries" 
ON service_inquiries 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Drop existing policy if exists and create authenticated select policy
DROP POLICY IF EXISTS "Allow authenticated read for inquiries" ON service_inquiries;
CREATE POLICY "Allow authenticated read for inquiries" 
ON service_inquiries 
FOR SELECT 
TO authenticated 
USING (true);


-- 3. Create Featured Projects Table
CREATE TABLE IF NOT EXISTS featured_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar TEXT NOT NULL,
    sector salino_sector NOT NULL,
    location_ar TEXT NOT NULL,
    metric_label_ar TEXT NOT NULL,
    metric_value TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) for projects
ALTER TABLE featured_projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists and create public read policy
DROP POLICY IF EXISTS "Allow public read for active projects" ON featured_projects;
CREATE POLICY "Allow public read for active projects" 
ON featured_projects 
FOR SELECT 
TO public 
USING (is_active = true);


-- 4. Seed Data: 6 Landmark Projects Across Egypt
INSERT INTO featured_projects (title_ar, sector, location_ar, metric_label_ar, metric_value, is_active)
VALUES
    (
        'تشغيل أسطول الإمداد اللوجستي والنقل الثقيل للحي الحكومي',
        'transport',
        'العاصمة الإدارية الجديدة',
        'إجمالي حمولات منقولة',
        '+120,000 طن',
        true
    ),
    (
        'منظومة الربط والنقل التبادلي لميناء العين السخنة الجاف',
        'transport',
        'المنطقة اللوجستية بالعين السخنة',
        'معدل الالتزام بالمواعيد',
        '99.8%',
        true
    ),
    (
        'توريد حديد التسليح وخامات الهيكل الخرساني للأبراج السكنية',
        'supplies',
        'القاهرة الجديدة - التجمع الخامس',
        'قيمة التوريدات المعتمدة',
        '185 مليون ج.م',
        true
    ),
    (
        'التوريدات الكهروميكانيكية والتشطيبات لمجمع صناعات أكتوبر',
        'supplies',
        'مدينة السادس من أكتوبر',
        'مطابقة الجودة والاعتماد',
        '100% قياسي',
        true
    ),
    (
        'إدارة وتسويق المحفظة الاستثمارية للوحدات الفندقية والتجارية',
        'real_estate',
        'منطقة الأعمال المركزية (CBD)',
        'قيمة التعاقدات العقارية',
        '+420 مليون ج.م',
        true
    ),
    (
        'استشارات التملك وإعادة البيع (ريسيل) للمجمعات السكنية الراقية',
        'real_estate',
        'زايد الجديدة وسفنكس',
        'عائد استثماري محقق للمستثمرين',
        '32% سنوياً',
        true
    )
ON CONFLICT (id) DO NOTHING;
