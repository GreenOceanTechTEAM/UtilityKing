
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Wifi, Smartphone, Flame, Droplets, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type ServicesSectionProps = {
  id: string;
};

const services = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Electricity",
    description: "Find cheaper fixed, variable, and renewable electricity tariffs from trusted UK suppliers.",
    link: "/energy"
  },
  {
    icon: <Flame className="h-8 w-8" />,
    title: "Gas",
    description: "Compare competitive gas prices and dual-fuel bundles available in your region.",
    link: "/gas"
  },
  {
    icon: <Wifi className="h-8 w-8" />,
    title: "Broadband",
    description: "Discover faster, more reliable broadband plans — and stop paying for speeds you don’t need.",
    link: "/broadband"
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: "Mobile / SIM",
    description: "Save money on SIM-only, unlimited, and flexible contract plans.",
    link: "/mobile"
  },
  {
    icon: <Droplets className="h-8 w-8" />,
    title: "Water",
    description: "Uncover ways to reduce water charges with smart usage insights and regional provider options.",
    link: "/water"
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Insurance",
    description: "Lower your home, boiler, and appliance cover costs with transparent, unbiased comparisons.",
    link: "/insurance"
  }
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
  hidden: { y: 18, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function ServicesSection({ id }: ServicesSectionProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, letterSpacing: "-0.05em" }}
          whileInView={{ opacity: 1, letterSpacing: "0em" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter leading-tight text-foreground">
            Find Savings In Every Corner Of Your Home
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Electricity, gas, broadband, water, mobile and insurance — everything in one place, optimized for your lifestyle and location.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 [perspective:900px]"
        >
          {services.map((service) => (
            <Link href={service.link} key={service.title} className="flex" prefetch={false}>
                <motion.div
                variants={itemVariants}
                whileHover={{
                    y: -8,
                    rotateX: '-6deg',
                    rotateY: '6deg',
                    boxShadow: '0px 8px 24px hsla(var(--primary), 0.15)',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full"
                >
                <Card className="group h-full transform transition-all duration-300">
                    <CardHeader className="p-6">
                    <motion.div
                        whileHover={{ scale: 1.12, rotate: -5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        {service.icon}
                    </motion.div>
                    <div>
                        <CardTitle className="font-body text-lg font-semibold">{service.title}</CardTitle>
                        <CardDescription className="pt-2 text-base leading-relaxed">{service.description}</CardDescription>
                    </div>
                    </CardHeader>
                </Card>
                </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
