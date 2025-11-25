import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CareersPage() {
  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-16">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Careers at UtilityKing
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Join our team and help us build the future of utility management. This is a boilerplate page for Careers. You can add job listings and company culture information here.
        </p>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/contact">Get In Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}