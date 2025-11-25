import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BroadbandPage() {
  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-16">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Broadband Services
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          This is a boilerplate page for Broadband services. You can add your content here.
        </p>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/#compare">Compare Broadband Deals</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}