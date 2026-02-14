import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

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
          From Our Fields to Your Table. Discover fresh, local produce and connect directly with farmers near you.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
            <Link href="/discover">
              Find Fresh Produce
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold">
            <Link href="/farmer/dashboard">
              I'm a Farmer
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
