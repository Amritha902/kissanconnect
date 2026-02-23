
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function RiderProfilePage() {
  return (
    <div>
      <PageHeader title="My Profile" />
      <div className="container mx-auto py-4 space-y-4">
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <User className="h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="font-semibold text-lg">Coming Soon</h3>
                <p className="text-muted-foreground text-sm">Your profile settings will be available here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
