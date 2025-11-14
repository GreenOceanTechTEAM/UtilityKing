"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

type AnimatedCTABannerProps = {
  id: string;
  type: 'quote' | 'chat';
  title: string;
  buttonText: string;
  buttonLink?: string;
};

export default function AnimatedCTABanner({ id, type, title, buttonText, buttonLink }: AnimatedCTABannerProps) {
  const bannerImage = PlaceHolderImages.find(p => p.id === (type === 'quote' ? 'cta-banner-1' : 'cta-banner-2'));
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);

  return (
    <section id={id} ref={targetRef} className="relative h-96 overflow-hidden">
      {bannerImage && (
        <motion.div className="absolute inset-0 z-0" style={{ y }}>
          <Image
            src={bannerImage.imageUrl}
            alt={bannerImage.description}
            fill
            className="object-cover"
            data-ai-hint={bannerImage.imageHint}
          />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-primary/70" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground px-4"
      >
        <div
          className={cn(
            "absolute inset-0 m-auto h-48 w-48 animate-pulse rounded-full bg-accent/30 blur-3xl",
            "md:h-64 md:w-64"
          )}
        />
        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl shimmer-text">
          {title}
        </h2>
        <div className="mt-8">
            <Button asChild size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {buttonLink ? <Link href={buttonLink}>{buttonText}</Link> : <button>{buttonText}</button>}
            </Button>
        </div>
      </motion.div>
    </section>
  );
}
