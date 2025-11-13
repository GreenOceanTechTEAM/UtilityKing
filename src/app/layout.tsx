import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ScrollProgressBar } from '@/components/layout/scroll-progress-bar';
import UKiChat from '@/components/shared/uki-chat';
import ScrollToTop from '@/components/layout/scroll-to-top';

export const metadata: Metadata = {
  title: 'Utility King AI',
  description: 'AI-powered utility comparisons to help you save.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <ScrollProgressBar />
        {children}
        <UKiChat />
        <ScrollToTop />
        <Toaster />
      </body>
    </html>
  );
}
