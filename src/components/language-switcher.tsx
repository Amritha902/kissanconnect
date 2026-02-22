'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

export function LanguageSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (newLocale: string) => {
    // The pathname from `next/navigation` doesn't include the locale.
    // So we construct the new path with the new locale.
    // e.g., pathname is '/dashboard', newLocale is 'de' -> '/de/dashboard'
    const newPath = `/${newLocale}${pathname}`;
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <Select onValueChange={onSelectChange} defaultValue={locale} disabled={isPending}>
      <SelectTrigger className="w-auto border-0 focus:ring-0 focus:ring-offset-0" aria-label={t('switchLanguage')}>
        <SelectValue>
           <Globe className="h-5 w-5" />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('en')}</SelectItem>
        <SelectItem value="hi">{t('hi')}</SelectItem>
        <SelectItem value="ta">{t('ta')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
