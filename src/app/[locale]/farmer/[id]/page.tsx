'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Phone, Award, Calendar, Leaf, ShoppingBag, MessageSquare, ShoppingCart, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useState } from 'react';
import { OrderDialog } from '@/components/consumer/order-dialog';
import { format } from 'date-fns';
import { useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function FarmerProfilePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const farmerDocRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return doc(firestore, 'users', params.id);
  }, [firestore, params.id]);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), where('farmerId', '==', params.id));
  }, [firestore, params.id]);

  const { data: farmer, isLoading: isFarmerLoading } = useDoc<any>(farmerDocRef);
  const { data: products, isLoading: areProductsLoading } = useCollection<any>(productsQuery);

  if (isFarmerLoading || areProductsLoading) {
    return (
        <div className="bg-background min-h-screen pb-24">
            <PageHeader title="Loading Profile..." />
            <div className="relative h-48 w-full bg-muted" />
            <div className="container mx-auto -mt-16">
                 <div className="flex items-end gap-4">
                    <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
                    {[...Array(4)].map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>)}
                </div>
                <div className="mt-6">
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (!farmer) {
    return notFound();
  }
  
  const coverImage = farmer.coverImage || "https://picsum.photos/seed/farm_cover/1200/400";
  const memberSince = farmer.memberSince ? format(new Date(farmer.memberSince), 'MMM yyyy') : 'N/A';

  return (
    <div className="bg-background min-h-screen pb-24">
      <PageHeader title={farmer.farmName || farmer.name} />

      <div className="relative h-48 w-full">
        <Image
          src={coverImage}
          alt={farmer.farmName || farmer.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto -mt-16">
        <div className="flex items-end gap-4">
          <Avatar className="h-24 w-24 border-4 border-background">
            {farmer.profilePhotoUrl && <AvatarImage src={farmer.profilePhotoUrl} alt={farmer.name} />}
            <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-headline text-2xl font-bold">{farmer.name}</h1>
            {farmer.rating > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span>{farmer.rating} ({farmer.totalReviews || 0} reviews)</span>
                </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
            <Card>
                <CardContent className="p-4">
                    <MapPin className="mx-auto h-6 w-6 text-primary mb-1"/>
                    <p className="text-sm font-semibold truncate">{farmer.address || 'Location private'}</p>
                    <p className="text-xs text-muted-foreground">Location</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <Phone className="mx-auto h-6 w-6 text-primary mb-1"/>
                    <p className="text-sm font-semibold">{farmer.totalCallsReceived || 0}</p>
                    <p className="text-xs text-muted-foreground">Calls Received</p>
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-4">
                    <Calendar className="mx-auto h-6 w-6 text-primary mb-1"/>
                    <p className="text-sm font-semibold">{memberSince}</p>
                    <p className="text-xs text-muted-foreground">Member Since</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                    {farmer.isVerified ? <Award className="h-6 w-6 text-primary mb-1"/> : <Award className="h-6 w-6 text-muted-foreground mb-1"/>}
                    <p className="text-sm font-semibold">{farmer.isVerified ? "Verified" : "Not Verified"}</p>
                     <p className="text-xs text-muted-foreground">Farmer</p>
                </CardContent>
            </Card>
        </div>

        <Tabs defaultValue="products" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products"><ShoppingBag className="mr-2 h-4 w-4"/>Products</TabsTrigger>
            <TabsTrigger value="reviews"><MessageSquare className="mr-2 h-4 w-4"/>Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products?.map((product) => {
                const productImage = product.photoUrls?.[0] || 'https://picsum.photos/seed/product/400/400';
                return (
                  <Card key={product.id} className="overflow-hidden flex flex-col">
                    <div className="relative aspect-square w-full">
                      <Image src={productImage} alt={product.name} fill className="object-cover" />
                       {product.isOrganic && <Badge className="absolute top-2 left-2 bg-primary"><Leaf className="mr-1 h-3 w-3"/>Organic</Badge>}
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <h4 className="font-semibold truncate">{product.name}</h4>
                      <p className="text-muted-foreground text-sm">{product.availableQuantity} {product.unit} left</p>
                      {product.expiresAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Fresh until {format(product.expiresAt.toDate(), 'PPP')}
                        </p>
                      )}
                      <p className="font-bold text-primary mt-1">₹{product.price}/{product.unit}</p>
                      <div className="flex-grow" />
                      <Button size="sm" className="w-full mt-2" onClick={() => setSelectedProduct(product)}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Order Now
                      </Button>
                    </div>
                  </Card>
                );
              })}
              {!areProductsLoading && products?.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                    This farmer has not listed any products yet.
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
               <p className="text-center text-muted-foreground py-8">Reviews are coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedProduct && (
        <OrderDialog
            product={selectedProduct}
            open={!!selectedProduct}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setSelectedProduct(null);
                }
            }}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
        <Button asChild size="lg" className="w-full font-bold text-lg bg-accent hover:bg-accent/90">
          <Link href={`tel:${farmer.phone}`}>
            <Phone className="mr-2 h-5 w-5" />
            Call Farmer
          </Link>
        </Button>
      </div>
    </div>
  );
}
