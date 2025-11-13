import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type AboutSectionProps = {
  id: string;
};

export default function AboutSection({ id }: AboutSectionProps) {
  const image = PlaceHolderImages.find(p => p.id === "about-team");
  
  return (
    <section id={id} className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              About Utility King AI
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              We started Utility King AI with a simple mission: to demystify the complex world of utility services. Our team of experts and our advanced AI, UKi, work tirelessly to bring you unbiased, data-driven comparisons.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              We believe everyone deserves a fair deal. That's why our service is, and always will be, completely free for you to use. We're here to empower you with the information you need to make smarter choices and save money.
            </p>
          </div>
          {image && (
             <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={600}
                    height={400}
                    data-ai-hint={image.imageHint}
                    className="object-cover aspect-[3/2] transition-transform duration-300 hover:scale-105"
                />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
