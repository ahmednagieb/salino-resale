import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Compound, ResaleProperty, ResaleFilterParams, SellerSubmission, LeadPriority } from '@/types/database';
import { MOCK_COMPOUNDS, MOCK_PROPERTIES, MOCK_SUBMISSIONS } from './mockData';
import { cleanSecondaryImagesForSoldProperty } from './imageUpload';

// In-memory local storage fallback for interactive client-side testing when Supabase is not connected
const localProperties: ResaleProperty[] = [...MOCK_PROPERTIES];
const localCompounds: Compound[] = [...MOCK_COMPOUNDS];
const localSubmissions: SellerSubmission[] = [...MOCK_SUBMISSIONS];

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
 * Submit seller unit (Public Form) - Connects directly to Supabase CRM
 */
export async function submitSellerUnit(
  submission: Omit<SellerSubmission, 'id' | 'status' | 'created_at'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  const paid = Number(submission.paid_amount || 0);
  const over = Number(submission.over_price || 0);
  const overRatio = paid > 0 ? (over / paid) * 100 : 0;
  const autoPriority: LeadPriority = overRatio <= 15 ? 'hot' : overRatio <= 30 ? 'warm' : 'cold';

  const generatedId = `REQ-${Date.now().toString().slice(-6)}`;
  const newSubmission: SellerSubmission = {
    ...submission,
    id: generatedId,
    status: 'new',
    priority: autoPriority,
    created_at: new Date().toISOString(),
  };

  localSubmissions.unshift(newSubmission);

  if (!isSupabaseConfigured) {
    return { success: true, id: newSubmission.id };
  }

  try {
    const payload = {
      owner_name: submission.owner_name,
      owner_phone: submission.owner_phone,
      compound_name: submission.compound_name,
      property_type: submission.property_type || 'شقة',
      area_sqm: Number(submission.area_sqm || 0),
      paid_amount: paid,
      over_price: over,
      remaining_amount: Number(submission.remaining_amount || 0),
      notes: submission.notes || '',
      status: 'new',
    };

    // Anonymous insert without .select() to adhere strictly to Supabase RLS public insert policy
    const { error } = await supabase
      .from('seller_submissions')
      .insert([payload]);

    if (error) {
      console.warn('Supabase submission insert fallback:', error.message);
    }

    return { success: true, id: generatedId };
  } catch (err: unknown) {
    console.warn('Supabase submission network error:', err);
    return { success: true, id: generatedId };
  }
}

/**
 * Admin: Get all seller submissions / CRM Leads
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

    if (error || !data || data.length === 0) {
      return localSubmissions;
    }

    // Merge Supabase data with any local mock fields if missing
    return (data as unknown as SellerSubmission[]).map((item) => ({
      ...item,
      priority: item.priority || (item.over_price && item.paid_amount && (item.over_price / item.paid_amount) <= 0.15 ? 'hot' : 'warm'),
      internal_notes: item.internal_notes || '',
      assigned_agent: item.assigned_agent || '',
    }));
  } catch {
    return localSubmissions;
  }
}

/**
 * Admin: Update submission status & CRM details
 */
export async function updateSubmission(
  id: string, 
  updates: Partial<SellerSubmission>
): Promise<boolean> {
  const item = localSubmissions.find(s => s.id === id);
  if (item) {
    Object.assign(item, updates, { updated_at: new Date().toISOString() });
  }

  if (isSupabaseConfigured) {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      
      await supabase.from('seller_submissions').update(dbUpdates).eq('id', id);
    } catch (err) {
      console.warn('Supabase submission update error:', err);
    }
  }
  return true;
}

/**
 * Backward compatibility helper
 */
export async function updateSubmissionStatus(
  id: string, 
  status: SellerSubmission['status']
): Promise<boolean> {
  return updateSubmission(id, { status });
}

/**
 * Admin: Delete a submission from CRM
 */
export async function deleteSubmission(id: string): Promise<boolean> {
  const idx = localSubmissions.findIndex(s => s.id === id);
  if (idx !== -1) {
    localSubmissions.splice(idx, 1);
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from('seller_submissions').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase submission delete error:', err);
    }
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
      const dbPayload = { ...prepared };
      delete (dbPayload as Partial<typeof prepared>).compound;
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
