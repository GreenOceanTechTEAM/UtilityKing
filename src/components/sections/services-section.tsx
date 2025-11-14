"use client";

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Wifi, Smartphone, Flame, Droplets, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type ServicesSectionProps = {
  id: string;
};

const services = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Energy",
    description: "Unlock cheaper electricity tariffs and slash your annual energy costs. Let UKi find you the best deal."
  },
  {
    icon: <Flame className="h-8 w-8" />,
    title: "Gas",
    description: "Switch to a better gas supplier in minutes. We compare the market to find you big savings."
  },
  {
    icon: <Wifi className="h-8 w-8" />,
    title: "Broadband",
    description: "From superfast fibre to budget-friendly plans, find the perfect broadband for your home."
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: "SIMs",
    description: "Get more data for your money. Compare the latest SIM-only deals from all major UK networks."
  },
  {
    icon: <Droplets className="h-8 w-8" />,
    title: "Water",
    description: "Discover if you can switch your water supplier or get a water meter to reduce your bills."
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Insurance",
    description: "Protect what matters most. Compare quotes for home, car, and travel insurance effortlessly."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, rotateY: -15 },
  visible: {
    y: 0,
    opacity: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function ServicesSection({ id }: ServicesSectionProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Find Savings in Every Corner of Your Home
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We help you find savings on more than just energy. Explore all the ways Utility King AI can help you save.
          </p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
            >
              <Card className="group h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30">
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <div className="transition-transform duration-300 group-hover:rotate-[-5deg]">
                        {service.icon}
                    </div>
                  </div>
                  <div className="transition-transform duration-300 group-hover:-translate-y-1">
                    <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                    <CardDescription className="pt-2">{service.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
