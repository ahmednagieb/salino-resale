import { getProperties, getCompounds } from '@/lib/dataService';
import PropertiesPageClient from '@/components/PropertiesPageClient';

export const dynamic = 'force-dynamic';

interface PropertiesPageProps {
  searchParams: Promise<{
    area?: string;
    compoundId?: string;
    propertyType?: string;
    maxDownPayment?: string;
    maxTotalPrice?: string;
    deliveryStatus?: string;
    query?: string;
    sortBy?: 'down_payment_asc' | 'total_price_asc' | 'newest';
  }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const resolvedParams = await searchParams;
  const compounds = await getCompounds();

  const properties = await getProperties({
    area: resolvedParams.area,
    compoundId: resolvedParams.compoundId,
    propertyType: resolvedParams.propertyType,
    maxDownPayment: resolvedParams.maxDownPayment ? Number(resolvedParams.maxDownPayment) : undefined,
    maxTotalPrice: resolvedParams.maxTotalPrice ? Number(resolvedParams.maxTotalPrice) : undefined,
    deliveryStatus: resolvedParams.deliveryStatus,
    query: resolvedParams.query,
    sortBy: resolvedParams.sortBy,
  });

  return (
    <PropertiesPageClient
      properties={properties}
      compounds={compounds}
      resolvedParams={resolvedParams}
    />
  );
}
