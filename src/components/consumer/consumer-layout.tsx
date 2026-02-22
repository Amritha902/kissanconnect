'use client';

import BottomNav from './bottom-nav';
import { Bell, User, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Logo } from '../logo';
import { LanguageSwitcher } from '../language-switcher';
import { Link } from 'next-intl/navigation';
import { cn } from '@/lib/utils';

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-2">
          <Logo withText={true} />

          <div className="flex flex-1 items-center justify-end space-x-1">
            <LanguageSwitcher />

            <Button variant="ghost" size="icon" className="relative" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {/* Notification badge — swap the hardcoded `3` for a real count */}
              <span
                className={cn(
                  'absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center',
                  'rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground',
                )}
              >
                3
              </span>
            </Button>

            {/* ✅ Fix: don't use asChild with next-intl Link — style the Link directly */}
            <Link
              href="/discover/profile"
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-md',
                'text-sm font-medium ring-offset-background transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
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