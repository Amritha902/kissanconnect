'use client';

import { PageHeader } from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { FarmerCard } from '@/components/consumer/farmer-card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useState } from 'react';

export default function SearchPage() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const farmersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), where('userType', '==', 'farmer'));
  }, [firestore]);

  const { data: farmers, isLoading } = useCollection<any>(farmersQuery);

  const filteredFarmers = farmers?.filter(farmer => 
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (farmer.address && farmer.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <PageHeader title="Search" />
      <div className="container mx-auto py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for farmers by name or location..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <h2 className="font-headline text-lg font-semibold">
            Results
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {isLoading && <p>Loading...</p>}
          {!isLoading && filteredFarmers?.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
          {!isLoading && filteredFarmers?.length === 0 && (
            <p className="text-center text-muted-foreground">No farmers found for your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
