"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

type TrustProofsProps = {
  id: string;
};

const testimonials = [
  {
    name: "Sarah J.",
    location: "Manchester",
    avatar: PlaceHolderImages.find(p => p.id === 'avatar-1'),
    quote: "I was skeptical at first, but UKi found me an energy deal that saved me over £300 a year. The process was incredibly simple. Highly recommended!"
  },
  {
    name: "David L.",
    location: "London",
    avatar: PlaceHolderImages.find(p => p.id === 'avatar-2'),
    quote: "The AI chat assistant is brilliant. I wasn't sure what broadband speed I needed, and it gave me a clear recommendation in minutes. I'm now on a faster and cheaper plan."
  },
  {
    name: "Emily R.",
    location: "Bristol",
    avatar: PlaceHolderImages.find(p => p.id === 'avatar-3'),
    quote: "Finally, a comparison site that's easy to use and doesn't feel biased. I've used it for both my energy and mobile contract. 5 stars!"
  }
];

const partners = [
  { name: 'Partner 1', logo: PlaceHolderImages.find(p => p.id === 'logo-1') },
  { name: 'Partner 2', logo: PlaceHolderImages.find(p => p.id === 'logo-2') },
  { name: 'Partner 3', logo: PlaceHolderImages.find(p => p.id === 'logo-3') },
  { name: 'Partner 4', logo: PlaceHolderImages.find(p => p.id === 'logo-4') },
  { name: 'Partner 5', logo: PlaceHolderImages.find(p => p.id === 'logo-5') },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const starContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const starVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 10 }
  },
};


const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [(index % 2 === 0 ? -1 : 1) * 40, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ x }}
      variants={itemVariants}
    >
      <Card className="flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30">
        <CardContent className="flex flex-1 flex-col justify-between p-6">
          <div>
              <motion.div
                className="flex mb-2"
                variants={starContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                  {[...Array(5)].map((_, i) => <motion.div key={i} variants={starVariants}><Star className="h-5 w-5 fill-accent text-accent" /></motion.div>)}
              </motion.div>
              <blockquote className="text-lg text-foreground">
                  <p>"{testimonial.quote}"</p>
              </blockquote>
          </div>
          <div className="mt-6 flex items-center">
            {testimonial.avatar && (
              <Avatar>
                <AvatarImage src={testimonial.avatar.imageUrl} alt={testimonial.name} data-ai-hint={testimonial.avatar.imageHint} />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="ml-4">
              <p className="font-semibold text-foreground">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


export default function TrustProofs({ id }: TrustProofsProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-primary/5 dark:bg-primary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Thousands of Savers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our users have to say about their experience.
          </p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </motion.div>
        <div className="mt-20">
          <p className="text-center text-base font-semibold text-muted-foreground">
            In partnership with the UK's leading providers
          </p>
          <div className="mt-6 grid grid-cols-2 gap-0.5 md:grid-cols-5 lg:mt-8">
            {partners.map((partner) => (
              partner.logo && (
                 <div key={partner.name} className="col-span-1 flex justify-center bg-background/50 p-8 grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100">
                    <Image
                    src={partner.logo.imageUrl}
                    alt={partner.name}
                    width={158}
                    height={48}
                    className="object-contain"
                    data-ai-hint={partner.logo.imageHint}
                    />
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
