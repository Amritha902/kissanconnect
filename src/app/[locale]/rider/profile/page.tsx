'use client';

import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, User, Shield, LogOut, Banknote, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut, Auth } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function RiderProfilePage() {
    const auth = useAuth();
    const router = useRouter();
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const uid = user?.uid;
    
    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !uid) return null;
        return doc(firestore, 'users', uid);
    }, [firestore, uid]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<any>(userDocRef);

    const handleLogout = async (auth: Auth) => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const menuItems = [
        { icon: User, label: 'Edit Profile', href: '/rider/profile/edit' },
        { icon: Banknote, label: 'Banking & Payments', href: '/rider/profile/banking' },
        { icon: Heart, label: 'My Reviews', href: '#' },
        { icon: Shield, label: 'Account Security', href: '#' },
    ];

    if (isUserLoading || isProfileLoading) {
        return (
             <div>
                <PageHeader title="My Profile" />
                <div className="container mx-auto py-4 space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </div>
                     <Card><CardContent className="p-0"><Skeleton className="h-48 w-full" /></CardContent></Card>
                     <Skeleton className="h-11 w-full" />
                </div>
            </div>
        )
    }

  return (
    <div>
      <PageHeader title="My Profile" />
      <div className="container mx-auto py-4 space-y-6">
        <div className="flex items-center gap-4">
             <Avatar className="h-20 w-20">
                {userProfile?.profilePhotoUrl && <AvatarImage src={userProfile.profilePhotoUrl} alt={userProfile.name} />}
                <AvatarFallback>{userProfile?.name?.charAt(0) || 'R'}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-headline text-2xl font-bold">{userProfile?.name || 'Rider'}</h2>
                <p className="text-muted-foreground">{userProfile?.phone || 'No phone number'}</p>
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
        
        <Button onClick={() => auth && handleLogout(auth)} variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
        </Button>
      </div>
    </div>
  );
}
