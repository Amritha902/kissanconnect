import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FarmerCard } from '@/components/consumer/farmer-card';
import { mockFarmers } from '@/lib/data';
import { List, Map, Search, SlidersHorizontal } from 'lucide-react';

const filters = ['Organic', 'Within 5km', 'Vegetables', 'Fruits', 'Fresh Today'];

export default function DiscoverPage() {
  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search tomatoes, onions..." className="pl-10" />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
          {filters.map((filter) => (
            <Button key={filter} variant="outline" size="sm" className="flex-shrink-0 bg-secondary/50">
              {filter}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
            <h2 className="font-headline text-lg font-semibold">Farmers Near You</h2>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm"><List className="mr-2 h-4 w-4"/> List</Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground"><Map className="mr-2 h-4 w-4"/> Map</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mockFarmers.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
      </div>
    </div>
  );
}
