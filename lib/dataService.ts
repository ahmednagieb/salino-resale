import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Compound, ResaleProperty, ResaleFilterParams, SellerSubmission } from '@/types/database';
import { MOCK_COMPOUNDS, MOCK_PROPERTIES, MOCK_SUBMISSIONS } from './mockData';
import { cleanSecondaryImagesForSoldProperty } from './imageUpload';

// In-memory local storage fallback for interactive client-side testing when Supabase is not connected
let localProperties: ResaleProperty[] = [...MOCK_PROPERTIES];
let localCompounds: Compound[] = [...MOCK_COMPOUNDS];
let localSubmissions: SellerSubmission[] = [...MOCK_SUBMISSIONS];

/**
 * Fetch all compounds
 */
export async function getCompounds(): Promise<Compound[]> {
  if (!isSupabaseConfigured) {
    return localCompounds;
  }

  try {
    const { data, error } = await supabase
      .from('compounds')
      .select('*')
      .order('area_name', { ascending: true });

    if (error || !data || data.length === 0) {
      return localCompounds;
    }
    return data as Compound[];
  } catch (err) {
    console.warn('Fallback to mock compounds:', err);
    return localCompounds;
  }
}

/**
 * Fetch resale properties with optional filtering
 */
export async function getProperties(params?: ResaleFilterParams): Promise<ResaleProperty[]> {
  if (!isSupabaseConfigured) {
    return filterLocalProperties(localProperties, params);
  }

  try {
    let query = supabase
      .from('resale_properties')
      .select(`
        *,
        compound:compounds(*)
      `);

    if (params?.area) {
      // Filter by compound area
      const matchingCompounds = localCompounds.filter(c => c.area_name.includes(params.area!));
      const compIds = matchingCompounds.map(c => c.id);
      if (compIds.length > 0) {
        query = query.in('compound_id', compIds);
      }
    }

    if (params?.compoundId) {
      query = query.eq('compound_id', params.compoundId);
    }

    if (params?.propertyType) {
      query = query.eq('property_type', params.propertyType);
    }

    if (params?.maxDownPayment) {
      query = query.lte('total_down_payment', params.maxDownPayment);
    }

    if (params?.maxTotalPrice) {
      query = query.lte('total_price', params.maxTotalPrice);
    }

    if (params?.deliveryStatus) {
      query = query.eq('delivery_status', params.deliveryStatus);
    }

    if (params?.sortBy === 'down_payment_asc') {
      query = query.order('total_down_payment', { ascending: true });
    } else if (params?.sortBy === 'total_price_asc') {
      query = query.order('total_price', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return filterLocalProperties(localProperties, params);
    }

    return data as ResaleProperty[];
  } catch (err) {
    console.warn('Fallback to mock properties:', err);
    return filterLocalProperties(localProperties, params);
  }
}

function filterLocalProperties(list: ResaleProperty[], params?: ResaleFilterParams): ResaleProperty[] {
  let result = [...list];

  if (!params) return result;

  if (params.area) {
    result = result.filter(p => p.compound?.area_name.includes(params.area!) || p.title_ar.includes(params.area!));
  }

  if (params.compoundId) {
    result = result.filter(p => p.compound_id === params.compoundId);
  }

  if (params.propertyType) {
    result = result.filter(p => p.property_type === params.propertyType);
  }

  if (params.maxDownPayment) {
    result = result.filter(p => p.total_down_payment <= params.maxDownPayment!);
  }

  if (params.maxTotalPrice) {
    result = result.filter(p => p.total_price <= params.maxTotalPrice!);
  }

  if (params.deliveryStatus) {
    result = result.filter(p => p.delivery_status.includes(params.deliveryStatus!));
  }

  if (params.bedrooms) {
    result = result.filter(p => p.bedrooms >= params.bedrooms!);
  }

  if (params.finishingType) {
    result = result.filter(p => p.finishing_type === params.finishingType);
  }

  if (params.query) {
    const q = params.query.toLowerCase();
    result = result.filter(
      p =>
        p.title_ar.toLowerCase().includes(q) ||
        p.reference_code.toLowerCase().includes(q) ||
        p.compound?.name_ar.toLowerCase().includes(q) ||
        p.compound?.area_name.toLowerCase().includes(q)
    );
  }

  if (params.sortBy === 'down_payment_asc') {
    result.sort((a, b) => a.total_down_payment - b.total_down_payment);
  } else if (params.sortBy === 'total_price_asc') {
    result.sort((a, b) => a.total_price - b.total_price);
  } else {
    result.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  }

  return result;
}

/**
 * Fetch a single property by ID or reference_code
 */
export async function getPropertyById(idOrRef: string): Promise<ResaleProperty | null> {
  if (!isSupabaseConfigured) {
    const found = localProperties.find(p => p.id === idOrRef || p.reference_code === idOrRef);
    return found || null;
  }

  try {
    const { data, error } = await supabase
      .from('resale_properties')
      .select(`
        *,
        compound:compounds(*)
      `)
      .or(`id.eq.${idOrRef},reference_code.eq.${idOrRef}`)
      .single();

    if (error || !data) {
      const found = localProperties.find(p => p.id === idOrRef || p.reference_code === idOrRef);
      return found || null;
    }

    return data as ResaleProperty;
  } catch (err) {
    console.warn('Fallback to mock property detail:', err);
    return localProperties.find(p => p.id === idOrRef || p.reference_code === idOrRef) || null;
  }
}

/**
 * Submit seller unit (Public Form)
 */
export async function submitSellerUnit(
  submission: Omit<SellerSubmission, 'id' | 'status' | 'created_at'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  const newSubmission: SellerSubmission = {
    ...submission,
    id: `sub-${Date.now()}`,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) {
    localSubmissions.unshift(newSubmission);
    return { success: true, id: newSubmission.id };
  }

  try {
    const { data, error } = await supabase
      .from('seller_submissions')
      .insert([submission])
      .select('id')
      .single();

    if (error) {
      localSubmissions.unshift(newSubmission);
      return { success: true, id: newSubmission.id };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    localSubmissions.unshift(newSubmission);
    return { success: true, id: newSubmission.id };
  }
}

/**
 * Admin: Get all seller submissions
 */
export async function getSellerSubmissions(): Promise<SellerSubmission[]> {
  if (!isSupabaseConfigured) {
    return localSubmissions;
  }

  try {
    const { data, error } = await supabase
      .from('seller_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return localSubmissions;
    }
    return data as SellerSubmission[];
  } catch (err) {
    return localSubmissions;
  }
}

/**
 * Admin: Update submission status
 */
export async function updateSubmissionStatus(id: string, status: SellerSubmission['status']): Promise<boolean> {
  const item = localSubmissions.find(s => s.id === id);
  if (item) item.status = status;

  if (isSupabaseConfigured) {
    await supabase.from('seller_submissions').update({ status }).eq('id', id);
  }
  return true;
}

/**
 * Admin: Create or update property
 */
export async function saveProperty(property: Partial<ResaleProperty>): Promise<ResaleProperty> {
  // Ensure financial integrity
  const paid = Number(property.paid_amount || 0);
  const over = Number(property.over_price || 0);
  const downPayment = paid + over;
  const remaining = Number(property.remaining_installments || 0);
  const totalPrice = downPayment + remaining;

  const prepared: ResaleProperty = {
    id: property.id || `res-${Date.now()}`,
    reference_code: property.reference_code || `RES-${Math.floor(100 + Math.random() * 900)}`,
    title_ar: property.title_ar || '',
    description_ar: property.description_ar || '',
    compound_id: property.compound_id || localCompounds[0]?.id || '',
    compound: localCompounds.find(c => c.id === property.compound_id),
    property_type: property.property_type || 'شقة',
    area_sqm: Number(property.area_sqm || 0),
    bedrooms: Number(property.bedrooms || 1),
    bathrooms: Number(property.bathrooms || 1),
    floor_number: Number(property.floor_number || 1),
    finishing_type: property.finishing_type || 'نصف تشطيب',
    delivery_status: property.delivery_status || 'استلام فوري',
    delivery_date: property.delivery_date,
    original_price: Number(property.original_price || 0),
    paid_amount: paid,
    over_price: over,
    total_down_payment: downPayment,
    remaining_installments: remaining,
    total_price: totalPrice,
    installment_years_left: Number(property.installment_years_left || 0),
    maintenance_fee: Number(property.maintenance_fee || 0),
    transfer_fee: Number(property.transfer_fee || 0),
    images: property.images || [],
    video_url: property.video_url,
    is_featured: Boolean(property.is_featured),
    status: property.status || 'available',
    created_at: property.created_at || new Date().toISOString(),
  };

  const existingIdx = localProperties.findIndex(p => p.id === prepared.id);
  if (existingIdx !== -1) {
    localProperties[existingIdx] = prepared;
  } else {
    localProperties.unshift(prepared);
  }

  if (isSupabaseConfigured) {
    try {
      const { compound, ...dbPayload } = prepared;
      await supabase.from('resale_properties').upsert(dbPayload);
    } catch (err) {
      console.error('Error saving property to Supabase:', err);
    }
  }

  return prepared;
}

/**
 * Admin Action: Mark property as Sold & Clean Storage
 * Automatically deletes all secondary images from storage, keeping only images[0].
 */
export async function markAsSoldAndCleanStorage(propertyId: string): Promise<ResaleProperty | null> {
  const property = await getPropertyById(propertyId);
  if (!property) return null;

  // Clean secondary images via imageUpload utility
  const cleanedImages = await cleanSecondaryImagesForSoldProperty(property.images);

  const updatedProperty: ResaleProperty = {
    ...property,
    status: 'sold',
    images: cleanedImages,
  };

  return saveProperty(updatedProperty);
}
