'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import { useTranslations } from 'next-intl';
// import { useRouter } from 'next-intl/navigation'; // REMOVED to prevent crash

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useAuth, useUser, useFirestore, setDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useLocale } from 'next-intl';

type UserType = 'consumer' | 'farmer';

export default function Home() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [userTypeToCreate, setUserTypeToCreate] = useState<UserType | null>(null);
  const uid = user?.uid;

  const memoizedUserDocRef = useMemoFirebase(() => {
    if (!firestore || !uid) return null;
    return doc(firestore, 'users', uid);
  }, [firestore, uid]);
  const { data: userProfile } = useDoc<any>(memoizedUserDocRef);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!isUserLoading && user && firestore) {
      // Using direct navigation to bypass the useRouter issue on this page.
      const navigate = (path: string) => {
        window.location.href = `/${locale}${path}`;
      };

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
           ...(userTypeToCreate === 'farmer' && {
            farmName: user.isAnonymous ? `Farm of ${user.uid.substring(0, 5)}` : `${user.displayName || 'Anonymous'}'s Farm`,
            coverImage: 'https://picsum.photos/seed/farm_cover/1200/400',
            rating: 0,
            totalReviews: 0,
            totalCallsReceived: 0,
            totalProductsListed: 0,
            bankAccountDetails: [],
            hashedAadhaar: '',
            certifications: [],
          })
        };

        setDocumentNonBlocking(userRef, userData, { merge: true });

        if (userTypeToCreate === 'farmer') {
          navigate('/farmer/dashboard');
        } else {
          navigate('/discover');
        }
        setUserTypeToCreate(null); 
      } else if(userProfile) {
         if (userProfile.userType === 'farmer') {
            navigate('/farmer/dashboard');
        } else {
            navigate('/discover');
        }
      }
    }
  }, [user, isUserLoading, userTypeToCreate, firestore, userProfile, locale]);

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
        <Image
            src="https://picsum.photos/seed/hero/1920/1080"
            alt="A vibrant farm landscape with fresh vegetables in the foreground."
            data-ai-hint="farm vegetables"
            fill
            className="object-cover"
            priority
          />
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
