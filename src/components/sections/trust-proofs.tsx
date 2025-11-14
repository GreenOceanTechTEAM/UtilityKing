"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

type TrustProofsProps = {
  id: string;
};

const testimonials = [
  {
    name: "Sarah M.",
    location: "Birmingham",
    avatar: PlaceHolderImages.find(p => p.id === 'avatar-1'),
    quote: "UtilityKing helped me save over £300 on my annual bill. The process took less than 5 minutes — highly recommend!"
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
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0, rotateX: -6 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      ease: "easeOut"
    },
  },
};

const starContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    },
  },
};

const starVariants = {
  hidden: { scale: 0, opacity: 0, color: "hsl(var(--muted))" },
  visible: {
    scale: 1,
    opacity: 1,
    color: "hsl(var(--accent))",
    transition: { type: 'spring', stiffness: 200, damping: 10, duration: 0.45 }
  },
};

const logoContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.2 },
  },
};

const logoVariants = {
    hidden: { scale: 0.96, opacity: 0 },
    visible: { scale: 1, opacity: 0.6, transition: { duration: 0.3 } },
};

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="flex flex-col h-full bg-card border-border hover:border-primary/80 hover:shadow-lg transition-all">
        <CardContent className="flex flex-1 flex-col justify-between p-6">
          <div>
              <motion.div
                className="flex mb-2"
                variants={starContainerVariants}
              >
                  {[...Array(5)].map((_, i) => <motion.div key={i} variants={starVariants}><Star className="h-5 w-5 fill-current" /></motion.div>)}
              </motion.div>
              <blockquote className="text-lg text-foreground leading-relaxed">
                  <p>"{testimonial.quote}"</p>
              </blockquote>
          </div>
          <motion.div 
            className="mt-6 flex items-center"
            whileHover="hover"
          >
            {testimonial.avatar && (
              <motion.div
                 variants={{ hover: { scale: 1.1 } }}
              >
                <Avatar>
                  <AvatarImage src={testimonial.avatar.imageUrl} alt={testimonial.name} data-ai-hint={testimonial.avatar.imageHint} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </motion.div>
            )}
            <div className="ml-4">
              <p className="text-base font-semibold text-foreground">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


export default function TrustProofs({ id }: TrustProofsProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-primary/5 dark:bg-primary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
            initial={{ opacity: 0, letterSpacing: "-0.05em" }}
            whileInView={{ opacity: 1, letterSpacing: "0em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Trusted by Thousands of Savvy UK Switchers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our users have to say about their experience.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </motion.div>
        <div className="mt-20">
          <p className="text-center text-base font-semibold text-muted-foreground">
            In partnership with the UK's leading providers
          </p>
          <motion.div
             variants={logoContainerVariants}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.5 }}
             className="mt-6 grid grid-cols-2 gap-0.5 md:grid-cols-5 lg:mt-8"
          >
            {partners.map((partner) => (
              partner.logo && (
                 <motion.div
                    key={partner.name}
                    variants={logoVariants}
                    whileHover={{ opacity: 1, y: -4 }}
                    className="col-span-1 flex justify-center bg-background/50 p-8 grayscale transition-all hover:grayscale-0"
                 >
                    <Image
                    src={partner.logo.imageUrl}
                    alt={partner.name}
                    width={158}
                    height={48}
                    className="object-contain"
                    data-ai-hint={partner.logo.imageHint}
                    />
                </motion.div>
              )
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
