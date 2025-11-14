"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Scale, Bot, MousePointerClick, ShieldCheck, SquareCheckBig, Users, Euro, Smile, TrendingUp } from 'lucide-react';
import AnimatedNumber from '../shared/animated-number';
import { motion } from 'framer-motion';

type WhyUtilityKingProps = {
  id: string;
};

const stats = [
    { value: 10000, label: "Trusted UK Users", suffix: "+", icon: Users },
    { value: 284, label: "Average Annual Savings", prefix: "£", icon: Euro },
    { value: 98, label: "Customer Satisfaction", suffix: "%", icon: Smile }
];

const values = [
  {
    icon: Scale,
    title: "100% Impartial",
    description: "Our recommendations are based purely on data and what's best for you, not on commissions."
  },
  {
    icon: Bot,
    title: "UKi AI-powered help",
    description: "Our smart assistant is powered by AI, always available to answer your questions and guide you."
  },
  {
    icon: MousePointerClick,
    title: "One-Click Switching",
    description: "Our streamlined process makes switching providers quick and hassle-free."
  },
  {
    icon: ShieldCheck,
    title: "GDPR & Data Safe",
    description: "Your privacy is paramount. We follow the strictest data protection standards."
  },
  {
    icon: SquareCheckBig,
    title: "Free to Use",
    description: "Our comparison service is completely free, with no obligation to switch."
  },
  {
    icon: TrendingUp,
    title: "Live Rates",
    description: "We fetch real-time data to ensure you're getting the most up-to-date prices and deals."
  }
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
}

const itemVariants = (side: 'left' | 'right') => ({
    hidden: { x: side === 'left' ? -10 : 10, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
})


export default function WhyUtilityKing({ id }: WhyUtilityKingProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Utility King Difference
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We're not just another comparison site. We're a technology company dedicated to making the utility market fair and transparent for everyone.
          </p>
        </div>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
             <motion.div key={value.title} variants={itemVariants(index % 2 === 0 ? 'left' : 'right')}>
                 <Card className="bg-transparent border-0 shadow-none hover:bg-muted/30 transition-colors h-full">
                     <CardHeader className="flex flex-row items-start gap-4 p-4">
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 2, -2, 0]
                          }}
                          transition={{
                            duration: 4,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 1,
                            delay: Math.random() * 2
                          }}
                         className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-accent">
                            <div><Icon className="h-8 w-8 text-accent" /></div>
                        </motion.div>
                        <div>
                            <CardTitle className="text-lg leading-6">{value.title}</CardTitle>
                            <CardDescription className="mt-2 text-base">{value.description}</CardDescription>
                        </div>
                    </CardHeader>
                </Card>
             </motion.div>
          )})}
        </motion.div>
        
        <div className="mt-20">
             <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="grid grid-cols-1 gap-8 md:grid-cols-3"
            >
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div key={stat.label} variants={itemVariants(index === 0 ? 'left' : index === 1 ? 'left' : 'right')}>
                        <Card className="text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
                          <CardContent className="flex flex-col items-center justify-center p-6">
                            <Icon className="h-8 w-8 text-muted-foreground" />
                            <div className="relative text-5xl font-bold font-headline text-primary mt-4">
                                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                            </div>
                            <p className="text-lg text-muted-foreground mt-2">
                                {stat.label}
                            </p>
                          </CardContent>
                        </Card>
                    </motion.div>
                )})}
             </motion.div>
        </div>
      </div>
    </section>
  );
}
