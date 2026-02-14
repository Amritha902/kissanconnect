
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChevronRight, User, Store, Shield, LogOut, Banknote } from 'lucide-react';
import Link from 'next/link';

export default function FarmerProfilePage() {
    const userImage = PlaceHolderImages.find(p => p.id === 'farmer1');
    const menuItems = [
        { icon: User, label: 'Edit Personal Details', href: '/farmer/profile/edit' },
        { icon: Store, label: 'Manage Farm Profile', href: '#' },
        { icon: Banknote, label: 'Banking & Payments', href: '/farmer/profile/banking' },
        { icon: Shield, label: 'Account Security', href: '#' },
    ];
  return (
    <div>
      <PageHeader title="My Profile" />
      <div className="container mx-auto py-4 space-y-6">
        <div className="flex items-center gap-4">
             <Avatar className="h-20 w-20">
                {userImage && <AvatarImage src={userImage.imageUrl} alt="Ravi Kumar" />}
                <AvatarFallback>RK</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-headline text-2xl font-bold">Ravi Kumar</h2>
                <p className="text-muted-foreground">+91 9123456789</p>
            </div>
        </div>

        <Card>
            <CardContent className="p-0">
               {menuItems.map(item => (
                 <Link href={item.href} key={item.label} className="block transition-colors hover:bg-muted/50">
                    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
                        <div className="flex items-center gap-4">
                            <item.icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                 </Link>
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
