
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CareersPage() {
  useEffect(() => {
    window.location.href = '/career.html';
  }, []);

  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-16">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Redirecting...
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Please wait while we redirect you to the careers page.
        </p>
      </div>
    </div>
  );
}
