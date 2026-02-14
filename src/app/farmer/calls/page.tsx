
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockFarmerDashboardData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PhoneCall } from 'lucide-react';

export default function FarmerCallsPage() {
  const calls = [
    ...mockFarmerDashboardData.recentCalls,
    { id: 'c3', consumerName: 'Vikram Reddy', productName: 'Organic Grapes', time: 'Yesterday, 2:15 PM' },
    { id: 'c4', consumerName: 'Sunita Devi', productName: 'Tomatoes', time: '2 days ago, 9:00 AM' }
  ];

  const consumerImages: { [key: string]: string } = {
      'Amit Singh': 'consumer1',
      'Priya Sharma': 'consumer2',
      'Vikram Reddy': 'consumer1',
      'Sunita Devi': 'consumer2',
  }

  return (
    <div>
      <PageHeader title="Calls Received" />
      <div className="container mx-auto py-4 space-y-4">
        {calls.map((call) => {
            const userImageId = consumerImages[call.consumerName];
            const userImage = PlaceHolderImages.find(p => p.id === userImageId);
            return (
                 <Card key={call.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                {userImage && <AvatarImage src={userImage.imageUrl} alt={call.consumerName} />}
                                <AvatarFallback>{call.consumerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{call.consumerName}</p>
                                <p className="text-sm">wants to buy <span className="font-medium">{call.productName}</span></p>
                                <p className="text-xs text-muted-foreground">{call.time}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            <PhoneCall className="mr-2 h-4 w-4"/>
                            Call Back
                        </Button>
                    </CardContent>
                </Card>
            )
        })}
      </div>
    </div>
  );
}
