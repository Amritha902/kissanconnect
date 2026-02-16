'use client';

import { useRouter } from 'next-intl/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PageHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, children }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="font-headline text-xl font-bold">{title}</h1>
      </div>
      <div>{children}</div>
    </div>
  );
}
