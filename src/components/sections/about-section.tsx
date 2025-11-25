
"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

type AboutSectionProps = {
  id: string;
};

const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.04, delayChildren: 0.2 }
    }
};

const textLineVariants = {
    hidden: { y: 6, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 12 }
    }
};

const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -5 },
    visible: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 80, damping: 15, delay: 0.4, duration: 0.6 }
    }
}

export function AboutSection({ id }: AboutSectionProps) {
  const image = PlaceHolderImages.find(p => p.id === "about-team");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  
  return (
    <section id={id} ref={ref} className="py-16 sm:py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div 
            className="max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textContainerVariants}
          >
            <motion.h2 variants={textLineVariants} className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Empowering UK Households With Smarter, Fairer Energy Choices
            </motion.h2>
            <motion.p variants={textLineVariants} className="mt-6 text-lg text-muted-foreground max-w-[680px] leading-relaxed">
              UtilityKing is a modern comparison platform built to help you cut costs and take control of your household utilities.
            </motion.p>
            <motion.p variants={textLineVariants} className="mt-4 text-lg text-muted-foreground max-w-[680px] leading-relaxed">
              We analyze real-time supplier data, recommend the best value options, and simplify switching into a fast, seamless journey — saving you time, money, and stress.
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
                <motion.div style={{ y: imageY }} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
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
