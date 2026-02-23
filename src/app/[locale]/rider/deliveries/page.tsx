
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function RiderDeliveriesPage() {
  return (
    <div>
      <PageHeader title="My Deliveries" />
      <div className="container mx-auto py-4 space-y-4">
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="font-semibold text-lg">Coming Soon</h3>
                <p className="text-muted-foreground text-sm">A list of your active and past deliveries will appear here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
