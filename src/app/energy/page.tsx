import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EnergyPage() {
  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-16">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Energy Services
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          This is a boilerplate page for Energy services (Electricity and Gas). You can add your content here.
        </p>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/#compare">Compare Energy Deals</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}