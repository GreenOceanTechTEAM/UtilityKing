
"use client";

import { motion } from 'framer-motion';
import { FileText, BarChart3, Smile } from 'lucide-react';

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
  hidden: { opacity: 0, x: -50, rotateY: -20 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { type: 'spring', stiffness: 50, damping: 15 },
  },
};

const orbVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.3,
    },
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
        <div className="relative mt-20 max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="absolute left-8 top-0 h-full w-px bg-border"
          >
             <motion.div 
                className="absolute left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-accent shadow-[0_0_12px] shadow-accent"
                style={{
                    boxShadow: '0 0 12px hsl(var(--accent)), 0 0 20px hsl(var(--accent))'
                }}
                animate={{
                    y: ['0%', '1000%', '2100%']
                }}
                transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1,
                    delay: 1,
                }}
             />

          </motion.div>

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
                className="relative pl-20"
              >
                  <motion.div 
                    variants={orbVariants}
                    className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-lg"
                   >
                     <motion.div 
                        className="absolute inset-0 rounded-full"
                        style={{
                            boxShadow: '0 0 15px hsl(var(--accent) / 0.7)'
                        }}
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: [1, 2, 1], opacity: [0, 0.7, 0] }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                            delay: 0.5 + index * 0.3,
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                     />
                    <span className="relative font-headline text-2xl font-bold text-accent">{`0${index + 1}`}</span>
                  </motion.div>
                  <div className="text-left">
                    <div className="flex items-center gap-3">
                      {step.icon}
                      <h3 className="font-headline text-xl font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
