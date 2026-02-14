import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Leaf, Phone } from 'lucide-react';
import type { Farmer } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type FarmerCardProps = {
  farmer: Farmer;
};

export function FarmerCard({ farmer }: FarmerCardProps) {
  const profileImage = PlaceHolderImages.find(p => p.id === farmer.profileImage);

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          {profileImage && <AvatarImage src={profileImage.imageUrl} alt={farmer.name} data-ai-hint={profileImage.imageHint} />}
          <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-headline text-lg font-bold">{farmer.name}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>{farmer.rating} ({farmer.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{farmer.distance} km away</span>
            </div>
          </div>
        </div>
        {farmer.isOrganicCertified && <Badge variant="outline" className="border-primary text-primary flex-shrink-0"><Leaf className="mr-1 h-3 w-3" /> Organic</Badge>}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-muted-foreground">Top Products:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {farmer.topProducts.map((product) => {
                const productImage = PlaceHolderImages.find(p => p.id === product.image);
                return (
                    <div key={product.name} className="flex items-center gap-2 bg-secondary/30 p-2 rounded-md">
                        {productImage && (
                            <Image src={productImage.imageUrl} alt={product.name} width={24} height={24} className="rounded-sm" data-ai-hint={productImage.imageHint} />
                        )}
                        <div>
                            <p className="text-sm font-semibold">{product.name}</p>
                            <p className="text-xs text-muted-foreground">₹{product.price}/{product.unit}</p>
                        </div>
                    </div>
                )
            })}
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button className="flex-1 bg-primary hover:bg-primary/90">
            <Phone className="mr-2 h-4 w-4"/>
            Call Farmer
        </Button>
        <Button asChild variant="secondary" className="flex-1">
          <Link href={`/farmer/${farmer.id}`}>View All Products</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
