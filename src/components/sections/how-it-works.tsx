"use client";

import { motion } from 'framer-motion';
import { FileText, BarChart3, Smile } from 'lucide-react';

type HowItWorksProps = {
  id: string;
};

const steps = [
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: "Tell Us About Your Home",
    description: "Share your energy usage, home type, and preferences. No sensitive details needed — just enough for accurate comparison."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Compare Live Deals Instantly",
    description: "We analyze the latest electricity and gas tariffs available, ranking them by price, contract length, provider rating, and renewal fit."
  },
  {
    icon: <Smile className="h-8 w-8 text-accent" />,
    title: "Switch Online & Start Saving",
    description: "Pick your ideal deal and switch in minutes — no phone calls, no paperwork, no disruption to your supply."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ease: [0.17, 0.67, 0.45, 1.35], duration: 0.5 },
  },
};

export default function HowItWorks({ id }: HowItWorksProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-primary/5 dark:bg-primary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{y: 20, opacity: 0}}
          whileInView={{y: 0, opacity: 1}}
          viewport={{ once: true, amount: 0.3 }}
          transition={{duration: 0.6}}
          className="text-center"
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-foreground sm:text-4xl">
            Switching to a Cheaper Energy Deal Has Never Been Easier
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Our streamlined process makes finding a better utility deal simpler than ever before.
          </p>
        </motion.div>
        <div className="relative mt-20 max-w-2xl mx-auto">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="absolute left-8 top-0 w-px bg-border"
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
                className="relative pl-20"
              >
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ ease: "easeOut", duration: 0.9, delay: index * 0.2 }}
                    className="absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-lg"
                   >
                     <motion.div 
                        initial={{ scale: 1, opacity: 0 }}
                        whileInView={{ scale: [1, 1.08, 1], opacity: [0, 1, 0] }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.18,
                            delay: 0.5 + index * 0.2
                        }}
                     />
                    <span className="relative font-body text-lg font-semibold text-accent">{`0${index + 1}`}</span>
                  </motion.div>
                  <motion.div 
                     whileHover={{ y: -6 }}
                     transition={{ type: 'spring', stiffness: 300 }}
                     className="text-left"
                  >
                    <div className="flex items-center gap-3">
                      
                      <h3 className="font-body text-xl font-semibold leading-tight text-foreground">{step.title}</h3>
                    </div>
                    <p className="mt-2 text-base text-muted-foreground leading-relaxed">{step.description}</p>
                  </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
