import { getProperties, getCompounds } from '@/lib/dataService';
import HomePageClient from '@/components/HomePageClient';

export default async function HomePage() {
  const compounds = await getCompounds();
  const allProperties = await getProperties();
  const featuredProperties = allProperties.filter((p) => p.is_featured);
  const immediateDeliveryProperties = allProperties.filter((p) => p.delivery_status === 'استلام فوري');

  return (
    <HomePageClient
      compounds={compounds}
      allProperties={allProperties}
      featuredProperties={featuredProperties}
      immediateDeliveryProperties={immediateDeliveryProperties}
    />
  );
}
