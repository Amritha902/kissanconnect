
import { PageHeader } from '@/components/page-header';
import { FarmerCard } from '@/components/consumer/farmer-card';
import { mockFarmers } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const favoriteFarmers = mockFarmers.slice(0, 1);

  return (
    <div>
      <PageHeader title="My Favorite Farmers" />
      <div className="container mx-auto py-4">
        {favoriteFarmers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {favoriteFarmers.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>
        ) : (
          <Alert>
            <Heart className="h-4 w-4" />
            <AlertTitle>No Favorites Yet</AlertTitle>
            <AlertDescription>
              You haven't added any farmers to your favorites. Tap the heart icon on a farmer's profile to add them.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
