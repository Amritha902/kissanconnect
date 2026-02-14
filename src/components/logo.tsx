import { LeafIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export function Logo({ className, withText = false }: { className?: string; withText?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LeafIcon className="h-8 w-8 text-primary" />
      {withText && <span className="font-headline text-2xl font-bold">KisanConnect</span>}
    </div>
  );
}
