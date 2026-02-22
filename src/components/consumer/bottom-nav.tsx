'use client';

import { Link } from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/discover', icon: Home, label: 'Discover' },
  { href: '/discover/favorites', icon: Heart, label: 'Favorites' },
  { href: '/discover/calls', icon: Phone, label: 'Calls' },
  { href: '/discover/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t z-50">
      <nav className="grid h-full grid-cols-4 items-center">
        {navItems.map((item) => {
          const isActive = pathname === `/en${item.href}` || pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-sm font-medium',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
