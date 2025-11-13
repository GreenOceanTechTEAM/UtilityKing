"use client";

import { motion } from 'framer-motion';
import { FileText, BarChart3, Smile } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';

type HowItWorksProps = {
  id: string;
};

const steps = [
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: "Share Your Details",
    description: "Provide a few details about your current usage, location, and what you're looking for in a new plan."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Compare Deals Instantly",
    description: "Our AI, UKi, instantly analyzes thousands of deals to find the perfect matches for you, showing clear savings."
  },
  {
    icon: <Smile className="h-8 w-8 text-accent" />,
    title: "Switch and Save",
    description: "Choose your new plan, and we'll handle the switch. It's a seamless process, and you start saving money."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 10 },
  },
};

export default function HowItWorks({ id }: HowItWorksProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-primary/5 dark:bg-primary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Saving Money is as Easy as 1-2-3
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Our streamlined process makes finding a better utility deal simpler than ever before.
          </p>
        </div>
        <div className="relative mt-20">
          {/* The connecting line */}
          <div
            className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-border md:block"
            aria-hidden="true"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="space-y-16"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="relative flex flex-col items-center md:flex-row"
              >
                <div className="flex w-full items-center gap-8 md:w-1/2 md:pr-16" style={{ flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}>
                  <div className={`flex-shrink-0 md:order-${index % 2 === 0 ? 1 : 2}`}>
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-lg">
                      <div className="absolute inset-0 m-auto h-full w-full animate-pulse rounded-full bg-accent/30 blur-xl" />
                      <span className="relative font-headline text-2xl font-bold text-accent">{`0${index + 1}`}</span>
                    </div>
                  </div>
                  <div className={`flex-grow md:order-${index % 2 === 0 ? 2 : 1} text-center md:text-left`} style={{textAlign: index % 2 === 0 ? 'left' : 'right'}}>
                    <div className="inline-flex items-center gap-3">
                      {step.icon}
                      <h3 className="font-headline text-xl font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                 {/* Empty div for spacing on the other side */}
                <div className="hidden md:block md:w-1/2"></div>
                 {/* This re-orders the content for alternating layout on medium screens */}
                <style jsx>{`
                  @media (min-width: 768px) {
                    .md\\:flex-row:nth-child(odd) > div:first-child {
                        margin-left: 50%;
                    }
                    .md\\:flex-row:nth-child(even) > div:first-child {
                        margin-right: 50%;
                    }
                  }
                `}</style>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
