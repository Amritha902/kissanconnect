import BottomNav from './bottom-nav';
import { Bell, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Logo } from '../logo';
import { LanguageSwitcher } from '../language-switcher';

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Logo withText={true} />
          <div className="flex flex-1 items-center justify-end space-x-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
