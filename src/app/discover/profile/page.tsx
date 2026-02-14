
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChevronRight, User, MapPin, Bell, LogOut } from 'lucide-react';

export default function ConsumerProfilePage() {
    const userImage = PlaceHolderImages.find(p => p.id === 'consumer2');
    const menuItems = [
        { icon: User, label: 'Edit Profile' },
        { icon: MapPin, label: 'Saved Addresses' },
        { icon: Bell, label: 'Notification Settings' },
    ];
  return (
    <div>
      <PageHeader title="My Profile" />
      <div className="container mx-auto py-4 space-y-6">
        <div className="flex items-center gap-4">
             <Avatar className="h-20 w-20">
                {userImage && <AvatarImage src={userImage.imageUrl} alt="Priya Sharma" />}
                <AvatarFallback>PS</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-headline text-2xl font-bold">Priya Sharma</h2>
                <p className="text-muted-foreground">+91 9876543210</p>
            </div>
        </div>

        <Card>
            <CardContent className="p-0">
               {menuItems.map(item => (
                 <div key={item.label} className="flex items-center justify-between p-4 border-b last:border-b-0">
                    <div className="flex items-center gap-4">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                 </div>
               ))}
            </CardContent>
        </Card>
        
        <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
        </Button>
      </div>
    </div>
  );
}
