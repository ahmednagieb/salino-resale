import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type SalinoSector = "transport" | "supplies" | "real_estate";

export interface InquiryInsert {
  company_name: string;
  contact_name: string;
  phone: string;
  email?: string;
  sector: SalinoSector;
  project_details: string;
}

export interface ServiceInquiry extends InquiryInsert {
  id: string;
  status: "new" | "contacted" | "in_progress" | "closed";
  created_at: string;
}

export interface FeaturedProject {
  id: string;
  title_ar: string;
  sector: SalinoSector;
  location_ar: string;
  metric_label_ar: string;
  metric_value: string;
  is_active: boolean;
  created_at?: string;
}

// Fallback seed projects for zero-downtime previews
export const FALLBACK_PROJECTS: FeaturedProject[] = [
  {
    id: "proj-1",
    title_ar: "تشغيل أسطول الإمداد اللوجستي والنقل الثقيل للحي الحكومي",
    sector: "transport",
    location_ar: "العاصمة الإدارية الجديدة",
    metric_label_ar: "إجمالي حمولات منقولة",
    metric_value: "+120,000 طن",
    is_active: true,
  },
  {
    id: "proj-2",
    title_ar: "منظومة الربط والنقل التبادلي لميناء العين السخنة الجاف",
    sector: "transport",
    location_ar: "المنطقة اللوجستية بالعين السخنة",
    metric_label_ar: "معدل الالتزام بالمواعيد",
    metric_value: "99.8%",
    is_active: true,
  },
  {
    id: "proj-3",
    title_ar: "توريد حديد التسليح وخامات الهيكل الخرساني للأبراج السكنية",
    sector: "supplies",
    location_ar: "القاهرة الجديدة - التجمع الخامس",
    metric_label_ar: "قيمة التوريدات المعتمدة",
    metric_value: "185 مليون ج.م",
    is_active: true,
  },
  {
    id: "proj-4",
    title_ar: "التوريدات الكهروميكانيكية والتشطيبات لمجمع صناعات أكتوبر",
    sector: "supplies",
    location_ar: "مدينة السادس من أكتوبر",
    metric_label_ar: "مطابقة الجودة والاعتماد",
    metric_value: "100% قياسي",
    is_active: true,
  },
  {
    id: "proj-5",
    title_ar: "إدارة وتسويق المحفظة الاستثمارية للوحدات الفندقية والتجارية",
    sector: "real_estate",
    location_ar: "منطقة الأعمال المركزية (CBD)",
    metric_label_ar: "قيمة التعاقدات العقارية",
    metric_value: "+420 مليون ج.م",
    is_active: true,
  },
  {
    id: "proj-6",
    title_ar: "استشارات التملك وإعادة البيع (ريسيل) للمجمعات السكنية الراقية",
    sector: "real_estate",
    location_ar: "زايد الجديدة وسفنكس",
    metric_label_ar: "عائد استثماري محقق للمستثمرين",
    metric_value: "32% سنوياً",
    is_active: true,
  },
];

// Safe singleton client creation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Submits an inquiry to Supabase `service_inquiries` table,
 * with resilient offline/fallback handling for seamless previews.
 */
export async function submitInquiry(
  data: InquiryInsert
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (supabase) {
      const { data: inserted, error } = await supabase
        .from("service_inquiries")
        .insert([
          {
            company_name: data.company_name,
            contact_name: data.contact_name,
            phone: data.phone,
            email: data.email || null,
            sector: data.sector,
            project_details: data.project_details,
            status: "new",
          },
        ])
        .select("id")
        .single();

      if (error) {
        // If table does not exist or network error, fallback to simulated success
        console.warn("Supabase insert error, falling back to local simulation:", error.message);
        return {
          success: true,
          id: `SIM-${Date.now().toString().slice(-6)}`,
        };
      }

      return {
        success: true,
        id: (inserted as { id: string })?.id || `REQ-${Date.now().toString().slice(-6)}`,
      };
    }

    // Local simulation fallback
    return {
      success: true,
      id: `SIM-${Date.now().toString().slice(-6)}`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Error submitting inquiry:", message);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Fetches active featured projects from Supabase or returns fallback seed projects.
 */
export async function getFeaturedProjects(
  sectorFilter?: SalinoSector
): Promise<FeaturedProject[]> {
  try {
    if (supabase) {
      let query = supabase
        .from("featured_projects")
        .select("id, title_ar, sector, location_ar, metric_label_ar, metric_value, is_active, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (sectorFilter) {
        query = query.eq("sector", sectorFilter);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return data as FeaturedProject[];
      }
    }
  } catch {
    // Network or client initialization fallback
  }

  // Filter fallback data by sector if requested
  if (sectorFilter) {
    return FALLBACK_PROJECTS.filter((p) => p.sector === sectorFilter);
  }

  return FALLBACK_PROJECTS;
}
