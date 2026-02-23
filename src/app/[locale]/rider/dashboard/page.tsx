
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Map } from 'lucide-react';

export default function RiderDashboardPage() {
  return (
    <div>
      <PageHeader title="Rider Dashboard" />
      <div className="container mx-auto py-4 space-y-4">
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Map className="h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="font-semibold text-lg">Welcome, Rider!</h3>
                <p className="text-muted-foreground text-sm">Your delivery assignments will appear here soon.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
