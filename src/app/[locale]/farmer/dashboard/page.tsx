'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/farmer/product-card';
import { Eye, Phone, Package, IndianRupee, PlusCircle, PhoneCall } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function FarmerDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'products'), where('farmerId', '==', user.uid), limit(3));
  }, [firestore, user]);

  const { data: products, isLoading: productsLoading } = useCollection<any>(productsQuery);
  
  const stats = [
    { label: 'Views', value: 'N/A', icon: Eye },
    { label: 'Calls', value: 'N/A', icon: Phone },
    { label: 'Products', value: products?.length || 0, icon: Package },
    { label: 'Earnings', value: 'N/A', icon: IndianRupee },
];

  return (
    <div className="container mx-auto py-4 space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold">👋 Hi {user?.displayName || 'Farmer'}!</h1>
        <p className="text-muted-foreground">Here's your farm's performance today.</p>
      </div>
      
      <div>
        <h2 className="text-lg font-headline font-semibold mb-2">Today's Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <stat.icon className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg">
        <Link href="/farmer/add-product">
          <PlusCircle className="mr-2 h-6 w-6" />
          Add New Product
        </Link>
      </Button>

      <div>
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-headline font-semibold">My Listings ({products?.length || 0} Active)</h2>
            <Button variant="link" asChild><Link href="/farmer/products">View All</Link></Button>
        </div>
        <div className="space-y-4">
          {productsLoading && (
            <>
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </>
          )}
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
           {!productsLoading && products?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">You haven't listed any products yet.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-headline font-semibold mb-2">Recent Calls</h2>
        <div className="space-y-2">
            <p className="text-center text-muted-foreground py-8">Call history will be available soon.</p>
        </div>
      </div>

    </div>
  );
}
