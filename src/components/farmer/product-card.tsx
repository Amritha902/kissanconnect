'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Phone, MoreVertical, Edit, Share2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useFirestore, deleteDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { buttonVariants } from '../ui/button';

type ProductCardProps = {
  product: any; // Using 'any' for now to match Firestore data
};

export function ProductCard({ product }: ProductCardProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    sold_out: 'bg-amber-100 text-amber-800 border-amber-200'
  };

  const handleDelete = () => {
    if (!firestore) return;
    const productRef = doc(firestore, 'products', product.id);
    deleteDocumentNonBlocking(productRef);
    toast({
      title: 'Product Deleted',
      description: `"${product.name}" has been removed from your listings.`,
    });
  };

  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex gap-4 p-4">
        <div className="relative aspect-square w-24 flex-shrink-0">
            {product.photoUrls && product.photoUrls[0] ? (
                 <Image src={product.photoUrls[0]} alt={product.name} layout="fill" className="rounded-md object-cover" />
            ): (
                <div className="w-full h-full bg-muted rounded-md" />
            )}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
              <Badge variant="outline" className={cn("capitalize text-xs", statusColors[product.status as keyof typeof statusColors])}>{product.status?.replace('_', ' ')}</Badge>
          </div>
          <p className="text-primary font-bold text-md">₹{product.price}/{product.unit}</p>
          
          <div className="flex-grow"></div>

          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{product.viewsCount || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{product.callsCount || 0} calls</span>
            </div>
          </div>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0 -mr-2">
                <MoreVertical className="h-5 w-5" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/farmer/products/edit/${product.id}`}><Edit className="mr-2 h-4 w-4"/> Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem><Share2 className="mr-2 h-4 w-4"/> Share</DropdownMenuItem>
            <DropdownMenuSeparator />
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={(e) => e.preventDefault()} // Prevents DropdownMenu from closing
                        >
                        <Trash2 className="mr-2 h-4 w-4"/> Delete
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your product
                            and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({variant: "destructive"}))}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
             </AlertDialog>
            </DropdownMenuContent>
      </DropdownMenu>
      </CardContent>
    </Card>
  );
}
