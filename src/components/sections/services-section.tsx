"use client";

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Zap, Wifi, Smartphone, Thermometer, FileText } from 'lucide-react';

type ServicesSectionProps = {
  id: string;
};

const services = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Energy Comparison",
    description: "Compare gas and electricity prices from UK suppliers to find a cheaper tariff and lower your energy bills."
  },
  {
    icon: <Wifi className="h-8 w-8 text-primary" />,
    title: "Broadband Planner",
    description: "Find faster, more reliable, and better-value broadband deals in your area, from standard to full-fibre."
  },
  {
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    title: "Mobile Data Match",
    description: "Analyze your data usage and find a mobile plan that gives you what you need without overpaying."
  },
  {
    icon: <Thermometer className="h-8 w-8 text-primary" />,
    title: "Smart Meter Advice",
    description: "Connect your smart meter data to get personalized insights and find tariffs that reward your usage patterns."
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Bill Decoder",
    description: "Upload or describe your bill, and our AI will break down the charges, identify savings, and check for errors."
  }
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

export default function ServicesSection({ id }: ServicesSectionProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            All Your Utilities, Smarter
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
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Card className="group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30">
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary text-primary group-hover:text-primary-foreground">
                    {service.icon}
                  </div>
                  <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                  <CardDescription className="pt-2">{service.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
