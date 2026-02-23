'use client';

import BottomNav from './bottom-nav';
import { Bell, User, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Logo } from '../logo';
import { LanguageSwitcher } from '../language-switcher';
import { Link } from 'next-intl/navigation';

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-2">
          <Logo withText={true} />

          <div className="flex flex-1 items-center justify-end space-x-1">
            <LanguageSwitcher />

            <Button asChild variant="ghost" size="icon" className="relative" aria-label="Search">
              <Link href="/discover/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {/* Notification badge — swap the hardcoded `3` for a real count */}
              <span
                className='absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground'
              >
                3
              </span>
            </Button>

            <Button asChild variant="ghost" size="icon">
              <Link href="/discover/profile" aria-label="Profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 animate-in fade-in duration-300">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
