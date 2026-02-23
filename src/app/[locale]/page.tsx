'use client';

import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('HomePage');

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
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
          >
            <Link href="/login?role=consumer">{t('findProduce')}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold"
          >
            <Link href="/login?role=farmer">{t('iAmFarmer')}</Link>
          </Button>
           <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-transparent border-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-background font-bold"
          >
            <Link href="/login?role=rider">I'm a Rider</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
