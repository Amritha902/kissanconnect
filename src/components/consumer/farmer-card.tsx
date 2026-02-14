'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Leaf, Phone } from 'lucide-react';
import type { User } from 'firebase/auth'; // Assuming a User type from Firebase
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '../ui/skeleton';

type FarmerCardProps = {
  farmer: any;
};

export function FarmerCard({ farmer }: FarmerCardProps) {
  const profileImage = PlaceHolderImages.find(p => p.id === 'farmer1'); // Example, should be dynamic

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          {farmer.profilePhotoUrl ? (
            <AvatarImage src={farmer.profilePhotoUrl} alt={farmer.name} />
          ) : (
            <AvatarFallback>{farmer.name?.charAt(0) || 'F'}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <h3 className="font-headline text-lg font-bold">{farmer.name}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {farmer.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>{farmer.rating} ({farmer.totalReviews || 0} reviews)</span>
              </div>
            )}
            {farmer.address && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{farmer.address}</span>
              </div>
            )}
          </div>
        </div>
        {farmer.isOrganicCertified && <Badge variant="outline" className="border-primary text-primary flex-shrink-0"><Leaf className="mr-1 h-3 w-3" /> Organic</Badge>}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">Contact this farmer to learn more about their products.</p>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
          <Link href={`tel:${farmer.phone}`}>
            <Phone className="mr-2 h-4 w-4"/>
            Call Farmer
          </Link>
        </Button>
        <Button asChild variant="secondary" className="flex-1">
          <Link href={`/farmer/${farmer.id}`}>View Profile & Products</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function FarmerCardSkeleton() {
    return (
      <Card className="overflow-hidden shadow-md">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </CardFooter>
      </Card>
    );
  }
