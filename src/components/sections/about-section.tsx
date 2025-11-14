"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';

type AboutSectionProps = {
  id: string;
};

const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 12, staggerChildren: 0.2, delayChildren: 0.2 }
    }
};

const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -5 },
    visible: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 80, damping: 15, delay: 0.4 }
    }
}

export default function AboutSection({ id }: AboutSectionProps) {
  const image = PlaceHolderImages.find(p => p.id === "about-team");
  
  return (
    <section id={id} className="py-16 sm:py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div 
            className="max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textVariants}
          >
            <motion.h2 variants={textVariants} className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              About Utility King AI
            </motion.h2>
            <motion.p variants={textVariants} className="mt-6 text-lg text-muted-foreground">
              We started Utility King AI with a simple mission: to demystify the complex world of utility services. Our team of experts and our advanced AI, UKi, work tirelessly to bring you unbiased, data-driven comparisons.
            </motion.p>
            <motion.p variants={textVariants} className="mt-4 text-lg text-muted-foreground">
              We believe everyone deserves a fair deal. That's why our service is, and always will be, completely free for you to use. We're here to empower you with the information you need to make smarter choices and save money.
            </motion.p>
          </motion.div>
          {image && (
             <motion.div 
                className="overflow-hidden rounded-2xl shadow-xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={imageVariants}
              >
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                    <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={600}
                        height={400}
                        data-ai-hint={image.imageHint}
                        className="object-cover aspect-[3/2]"
                    />
                </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
