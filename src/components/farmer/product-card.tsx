import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Phone, MoreVertical, Edit, Share2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Product } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const productImage = PlaceHolderImages.find(p => p.id === product.image);
  
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    sold_out: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="flex items-center gap-4 p-3 shadow-sm">
      <div className="relative h-20 w-20 flex-shrink-0">
        {productImage && <Image src={productImage.imageUrl} alt={product.name} layout="fill" className="rounded-md object-cover" data-ai-hint={productImage.imageHint} />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm font-bold text-primary">₹{product.price}/{product.unit}</p>
            </div>
             <Badge className={cn("capitalize", statusColors[product.status])}>{product.status.replace('_', ' ')}</Badge>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{product.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>{product.calls} calls</span>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
          <DropdownMenuItem><Share2 className="mr-2 h-4 w-4"/> Share</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4"/> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
