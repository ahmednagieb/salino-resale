export type PropertyType = 
  | 'شقة' 
  | 'دوبلكس' 
  | 'بنتهاوس' 
  | 'تاون هاوس' 
  | 'توين هاوس' 
  | 'فيلا مستقلة' 
  | 'شاليه'
  | 'استوديو';

export type FinishingType = 
  | 'بدون تشطيب' 
  | 'نصف تشطيب' 
  | 'تشطيب كامل' 
  | 'سوبر لوكس' 
  | 'ألترا سوبر لوكس';

export type DeliveryStatus = 
  | 'استلام فوري' 
  | 'استلام خلال 6 أشهر' 
  | 'استلام خلال سنة' 
  | 'استلام 2026' 
  | 'استلام 2027' 
  | 'استلام 2028+';

export type PropertyStatus = 'available' | 'sold' | 'pending';

export type SubmissionStatus = 'new' | 'contacted' | 'listed' | 'rejected';

export interface Compound {
  id: string;
  name_ar: string;
  name_en: string;
  area_name: string;
  developer_name: string;
  created_at?: string;
}

export interface ResaleProperty {
  id: string;
  reference_code: string; // e.g. RES-101
  title_ar: string;
  description_ar: string;
  compound_id: string;
  compound?: Compound;
  
  // Specifications
  property_type: PropertyType | string;
  area_sqm: number;
  bedrooms: number;
  bathrooms: number;
  floor_number: number;
  finishing_type: FinishingType | string;
  delivery_status: DeliveryStatus | string;
  delivery_date?: string;

  // Crucial Resale Financials
  original_price: number;
  paid_amount: number;             // المدفوع للمطور
  over_price: number;              // الأوفر برايس المطلوب
  total_down_payment: number;      // المطلوب كاش الآن = المدفوع + الأوفر
  remaining_installments: number;  // المتبقي أقساط
  total_price: number;             // السعر الإجمالي = المطلوب كاش + المتبقي أقساط
  installment_years_left: number;  // عدد سنوات القسط المتبقية
  maintenance_fee: number;         // وديعة الصيانة
  transfer_fee: number;            // مصاريف التنازل في الشركة

  // Media & Status
  images: string[];
  video_url?: string;
  is_featured: boolean;
  status: PropertyStatus;
  created_at: string;
}

export interface SellerSubmission {
  id: string;
  owner_name: string;
  owner_phone: string;
  compound_name: string;
  property_type: string;
  area_sqm: number;
  paid_amount: number;
  over_price: number;
  remaining_amount: number;
  notes?: string;
  status: SubmissionStatus;
  created_at: string;
}

export interface ResaleFilterParams {
  area?: string;
  compoundId?: string;
  propertyType?: string;
  maxDownPayment?: number;
  maxTotalPrice?: number;
  deliveryStatus?: string;
  bedrooms?: number;
  finishingType?: string;
  query?: string;
  sortBy?: 'down_payment_asc' | 'total_price_asc' | 'newest';
}
