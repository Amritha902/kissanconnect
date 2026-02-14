
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function CommunityPage() {

  return (
    <div>
      <PageHeader title="Farmer Community" />
      <div className="container mx-auto py-4 space-y-4">
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="font-semibold text-lg">Coming Soon!</h3>
                <p className="text-muted-foreground text-sm">A community feed for farmers to connect and share information will be available here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
