
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockFarmers } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Phone, PhoneOutgoing } from 'lucide-react';

export default function CallsPage() {
    const recentCalls = [
        {
            farmer: mockFarmers[0],
            time: 'Yesterday, 6:30 PM',
        },
        {
            farmer: mockFarmers[1],
            time: '3 days ago, 11:00 AM',
        }
    ];

  return (
    <div>
      <PageHeader title="Call History" />
      <div className="container mx-auto py-4 space-y-4">
        {recentCalls.map((call, index) => {
             const farmerImage = PlaceHolderImages.find(p => p.id === call.farmer.profileImage);
            return (
                <Card key={index}>
                    <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                {farmerImage && <AvatarImage src={farmerImage.imageUrl} alt={call.farmer.name} />}
                                <AvatarFallback>{call.farmer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{call.farmer.name}</p>
                                <p className="text-sm text-muted-foreground flex items-center">
                                    <PhoneOutgoing className="h-3 w-3 mr-1.5"/>
                                    {call.time}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="icon">
                            <Phone className="h-5 w-5"/>
                        </Button>
                    </CardContent>
                </Card>
            )
        })}
      </div>
    </div>
  );
}
