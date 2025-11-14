"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Scale, Bot, MousePointerClick, ShieldCheck, SquareCheckBig, Users, Euro, Smile } from 'lucide-react';
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

export default function WhyUtilityKing({ id }: WhyUtilityKingProps) {

  const values = [
    {
      icon: Scale,
      title: "100% Impartial",
      description: "Our recommendations are based purely on data and what's best for you, not on commissions."
    },
    {
      icon: Bot,
      title: "AI Powered by Gemini",
      description: "Our smart assistant, UKi, is always available to answer your questions and guide you."
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
    }
  ];

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

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
             <Card key={value.title} className="bg-transparent border-0 shadow-none hover:bg-muted/30 transition-colors">
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
          )})}
        </div>
        
        <div className="mt-20">
             <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.label} className="text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
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
                )})}
             </div>
        </div>
      </div>
    </section>
  );
}
