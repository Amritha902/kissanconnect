
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth, useUser, useFirestore, setDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

type UserType = 'consumer' | 'farmer';

export default function Home() {
  const t = useTranslations('HomePage');
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [userTypeToCreate, setUserTypeToCreate] = useState<UserType | null>(null);

  const userDocRef = (firestore && user) ? doc(firestore, 'users', user.uid) : null;
  const memoizedUserDocRef = useMemoFirebase(() => userDocRef, [userDocRef]);
  const { data: userProfile } = useDoc<any>(memoizedUserDocRef);

  useEffect(() => {
    if (!isUserLoading && user && firestore) {
      if (userTypeToCreate) {
        const userRef = doc(firestore, 'users', user.uid);
        const userData = {
          id: user.uid,
          phone: user.phoneNumber,
          name: user.isAnonymous ? `${userTypeToCreate === 'farmer' ? 'Farmer' : 'Consumer'} #${user.uid.substring(0, 5)}` : (user.displayName || 'New User'),
          userType: userTypeToCreate,
          profilePhotoUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
          location: [],
          address: '',
          isVerified: false,
          memberSince: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };

        setDocumentNonBlocking(userRef, userData, { merge: true });

        if (userTypeToCreate === 'farmer') {
          router.push('/farmer/dashboard');
        } else {
          router.push('/discover');
        }
        setUserTypeToCreate(null); 
      } else if(userProfile) {
         if (userProfile.userType === 'farmer') {
            router.push('/farmer/dashboard');
        } else {
            router.push('/discover');
        }
      }
    }
  }, [user, isUserLoading, userTypeToCreate, firestore, router, userProfile]);

  const handleLogin = (type: UserType) => {
    if (!auth) return;
    setUserTypeToCreate(type);
    initiateAnonymousSignIn(auth);
  };

  if (isUserLoading || user) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="absolute inset-0 -z-10">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="flex flex-col items-center justify-center text-center text-white p-8">
        <Logo className="text-white w-24 h-24 mb-4" />
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">KisanConnect</h1>
        <p className="mt-4 max-w-lg text-lg text-gray-200">
          {t('subtitle')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
            onClick={() => handleLogin('consumer')}
            disabled={isUserLoading}
          >
            {isUserLoading && userTypeToCreate === 'consumer' ? 'Entering...' : t('findProduce')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold"
            onClick={() => handleLogin('farmer')}
            disabled={isUserLoading}
          >
            {isUserLoading && userTypeToCreate === 'farmer' ? 'Entering...' : t('iAmFarmer')}
          </Button>
        </div>
      </div>
    </main>
  );
}
