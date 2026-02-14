import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';
import { NextIntlClientProvider, useMessages } from 'next-intl';

export const metadata: Metadata = {
  title: 'KisanConnect',
  description: 'A hyperlocal farm-to-consumer discovery platform.',
};

export default function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = useMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <FirebaseClientProvider>
            {children}
          </FirebaseClientProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
