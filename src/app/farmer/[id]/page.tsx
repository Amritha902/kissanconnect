import Image from 'next/image';
import { notFound } from 'next/navigation';
import { mockFarmers } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Phone, Award, Calendar, Leaf, ShoppingBag, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function FarmerProfilePage({ params }: { params: { id: string } }) {
  const farmer = mockFarmers.find((f) => f.id === params.id);

  if (!farmer) {
    notFound();
  }

  const coverImage = PlaceHolderImages.find(p => p.id === farmer.coverImage);
  const profileImage = PlaceHolderImages.find(p => p.id === farmer.profileImage);

  return (
    <div className="bg-background min-h-screen pb-24">
      <PageHeader title={farmer.farmName} />

      <div className="relative h-48 w-full">
        {coverImage && (
          <Image
            src={coverImage.imageUrl}
            alt={farmer.farmName}
            data-ai-hint={coverImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto -mt-16">
        <div className="flex items-end gap-4">
          <Avatar className="h-24 w-24 border-4 border-background">
            {profileImage && <AvatarImage src={profileImage.imageUrl} alt={farmer.name} data-ai-hint={profileImage.imageHint} />}
            <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-headline text-2xl font-bold">{farmer.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>{farmer.rating} ({farmer.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
            <Card>
                <CardContent className="p-4">
                    <MapPin className="mx-auto h-6 w-6 text-primary mb-1"/>
                    <p className="text-sm font-semibold">{farmer.distance} km</p>
                    <p className="text-xs text-muted-foreground">Away</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <Phone className="mx-auto h-6 w-6 text-primary mb-1"/>
                    <p className="text-sm font-semibold">{farmer.callCount}</p>
                    <p className="text-xs text-muted-foreground">Calls Received</p>
                </CardContent>
            </Card>
             <Card>
                <CardContent className="p-4">
                    <Calendar className="mx-auto h-6 w-6 text-primary mb-1"/>
                    <p className="text-sm font-semibold">{farmer.memberSince}</p>
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
              {farmer.products.map((product) => {
                const productImage = PlaceHolderImages.find(p => p.id === product.image);
                return (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative aspect-square w-full">
                      {productImage && <Image src={productImage.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={productImage.imageHint} />}
                       {product.isOrganic && <Badge className="absolute top-2 left-2 bg-primary"><Leaf className="mr-1 h-3 w-3"/>Organic</Badge>}
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold truncate">{product.name}</h4>
                      <p className="text-muted-foreground text-sm">{product.quantity}</p>
                      <p className="font-bold text-primary mt-1">₹{product.price}/{product.unit}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {farmer.reviews.map((review) => {
                 const consumerImage = PlaceHolderImages.find(p => p.id === review.consumerImage);
                return (
                  <Card key={review.id}>
                    <CardContent className="p-4 flex gap-4">
                      <Avatar>
                        {consumerImage && <AvatarImage src={consumerImage.imageUrl} alt={review.consumerName} data-ai-hint={consumerImage.imageHint} />}
                        <AvatarFallback>{review.consumerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{review.consumerName}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-foreground">{review.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
        <Button size="lg" className="w-full font-bold text-lg bg-accent hover:bg-accent/90">
          <Phone className="mr-2 h-5 w-5" />
          Call Farmer
        </Button>
      </div>
    </div>
  );
}
