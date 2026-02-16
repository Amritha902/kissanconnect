'use client';

import { PageHeader } from '@/components/page-header';
import { FarmerCard, FarmerCardSkeleton } from '@/components/consumer/farmer-card';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'next-intl/navigation';

export default function FavoritesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [favoriteFarmers, setFavoriteFarmers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !firestore) return;
      setIsLoading(true);
      const favoritesCol = collection(firestore, 'users', user.uid, 'favorites');
      const favoriteSnapshot = await getDocs(favoritesCol);
      const favoriteIds = favoriteSnapshot.docs.map(doc => doc.data().targetId);
      
      if (favoriteIds.length > 0) {
        const farmersQuery = query(collection(firestore, 'users'), where('id', 'in', favoriteIds));
        const farmerSnapshot = await getDocs(farmersQuery);
        const farmers = farmerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavoriteFarmers(farmers);
      } else {
        setFavoriteFarmers([]);
      }
      setIsLoading(false);
    };

    fetchFavorites();
  }, [user, firestore]);

  return (
    <div>
      <PageHeader title="My Favorite Farmers" />
      <div className="container mx-auto py-4">
        {isLoading ? (
          <div className="space-y-4">
            <FarmerCardSkeleton />
            <FarmerCardSkeleton />
          </div>
        ) : favoriteFarmers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {favoriteFarmers.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No Favorites Yet</h3>
              <p className="text-muted-foreground text-sm">
                You haven't added any farmers to your favorites. Tap the heart on a farmer's profile to add them.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
