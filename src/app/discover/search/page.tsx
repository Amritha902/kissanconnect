
import { PageHeader } from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { FarmerCard } from '@/components/consumer/farmer-card';
import { mockFarmers } from '@/lib/data';

export default function SearchPage() {
  return (
    <div>
      <PageHeader title="Search" />
      <div className="container mx-auto py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for farmers, products..." className="pl-10" />
        </div>
        <div>
          <h2 className="font-headline text-lg font-semibold">
            Results
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {mockFarmers.slice(0,1).map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
      </div>
    </div>
  );
}
