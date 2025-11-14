"use client";

import Image, { type StaticImageData } from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

import logoBritishGas from '@/assets/britishgas.jpg';
import logoCrown from '@/assets/crown.png';
import logoEdf from '@/assets/edf.jpg';
import logoGulf from '@/assets/gulf.png';
// import logoHavenPower from '@/assets/haven-power.png'; // Please rename 'haven power.png' to 'haven-power.png' and uncomment
import logoNpower from '@/assets/npower.jpg';
import logoOpus from '@/assets/opus.png';
// import logoOvo from '@/assets/ovo-energy.jpg'; // Please rename 'ovo energy.jpg' to 'ovo-energy.jpg' and uncomment
import logoPozitive from '@/assets/pozitive.png';
// import logoScottishPower from '@/assets/scottish-power.jpg'; // Please rename 'scottish power.jpg' to 'scottish-power.jpg' and uncomment
import logoSse from '@/assets/sse.jpg';
import logoYue from '@/assets/yue.jpg';


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

const partners: { name: string; logo: StaticImageData }[] = [
    { name: 'British Gas', logo: logoBritishGas },
    { name: 'Crown Gas & Power', logo: logoCrown },
    { name: 'EDF Energy', logo: logoEdf },
    { name: 'Gulf Gas & Power', logo: logoGulf },
    // { name: 'Haven Power', logo: logoHavenPower }, // Uncomment after renaming file
    { name: 'npower', logo: logoNpower },
    { name: 'Opus Energy', logo: logoOpus },
    // { name: 'OVO Energy', logo: logoOvo }, // Uncomment after renaming file
    { name: 'Pozitive Energy', logo: logoPozitive },
    // { name: 'Scottish Power', logo: logoScottishPower }, // Uncomment after renaming file
    { name: 'SSE', logo: logoSse },
    { name: 'Yü Energy', logo: logoYue },
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

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300 } }}
    >
      <Card className="flex flex-col h-full bg-card border-border hover:border-primary/80 hover:shadow-lg transition-all">
        <CardContent className="flex flex-1 flex-col justify-between p-6">
          <div>
              <motion.div
                className="flex mb-2"
                variants={starContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
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
           <div className="relative mt-6 w-full overflow-hidden">
            <motion.div 
              className="flex items-center"
              animate={{
                x: ['0%', '-100%'],
              }}
              transition={{
                ease: 'linear',
                duration: 40,
                repeat: Infinity,
              }}
            >
              {[...partners, ...partners].map((partner, index) => (
                <motion.div
                  key={`${partner.name}-${index}`}
                  whileHover={{ y: -4, opacity: 1 }}
                  className="mx-8 flex-shrink-0"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    height={48}
                    className="object-contain h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
                  />
                </motion.div>
              ))}
            </motion.div>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-primary/5 to-transparent dark:from-primary/10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
