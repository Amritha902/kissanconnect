'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/farmer/product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function FarmerProductsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const uid = user?.uid;

  const productsQuery = useMemoFirebase(() => {
    if (!firestore || !uid) return null;
    return query(collection(firestore, 'products'), where('farmerId', '==', uid));
  }, [firestore, uid]);

  const { data: products, isLoading: productsLoading } = useCollection<any>(productsQuery);

  const activeProducts = products?.filter(p => p.status === 'active') || [];
  const inactiveProducts = products?.filter(p => p.status === 'inactive' || p.status === 'sold_out') || [];

  const isLoading = isUserLoading || productsLoading;

  return (
    <div>
      <PageHeader title="My Products">
        <Button asChild>
          <Link href="/farmer/add-product">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </PageHeader>
      <div className="container mx-auto py-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active ({activeProducts.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactiveProducts.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <div className="space-y-4 mt-4">
                {activeProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
                 {activeProducts.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No active products.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="inactive">
              <div className="space-y-4 mt-4">
                {inactiveProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
                 {inactiveProducts.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No inactive products.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
