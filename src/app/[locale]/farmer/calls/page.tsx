
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { PhoneCall } from 'lucide-react';

export default function FarmerCallsPage() {

  return (
    <div>
      <PageHeader title="Calls Received" />
      <div className="container mx-auto py-4 space-y-4">
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <PhoneCall className="h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="font-semibold text-lg">Coming Soon!</h3>
                <p className="text-muted-foreground text-sm">A log of all calls you receive from customers will appear here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
