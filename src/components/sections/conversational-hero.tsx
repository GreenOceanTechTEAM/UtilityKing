"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { conversationalHeroAssistance, ConversationalHeroAssistanceOutput } from '@/ai/flows/conversational-hero-assistance';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import EnergyGridBackground from '../shared/energy-grid-background';
import { cn } from '@/lib/utils';

type ConversationalHeroProps = {
  id: string;
};

const formSchema = z.object({
  userInput: z.string().min(10, {
    message: "Please describe what you're looking for.",
  }),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.5,
    },
  },
};

const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12,
            ease: "easeOut",
        },
    },
};

const subtitleVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            delay: 1.5
        }
    }
}

const formVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            delay: 1.8
        }
    }
}

export default function ConversationalHero({ id }: ConversationalHeroProps) {
  const [assistance, setAssistance] = useState<ConversationalHeroAssistanceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAssistance(null);
    try {
      const result = await conversationalHeroAssistance(values);
      setAssistance(result);
    } catch (error) {
      console.error("Hero assistance failed:", error);
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: "Sorry, I couldn't process that request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const headlineText = "Compare UK Energy Deals in Seconds — Switch Smarter, Save More.";
  const words = headlineText.split(" ");

  return (
    <section id={id} className="relative flex h-[90vh] min-h-[700px] items-center justify-center overflow-hidden">
      <EnergyGridBackground />
      <div className="absolute inset-0 z-[-1] bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h1 
                variants={containerVariants}
                className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-6xl lg:text-[60px] sm:leading-[1.08]"
            >
                {words.map((word, index) => (
                    <motion.span key={index} variants={wordVariants} className="inline-block mr-[0.25em]">
                        {word}
                    </motion.span>
                ))}
            </motion.h1>
            <motion.p 
                variants={subtitleVariants}
                className="mt-6 max-w-xl mx-auto text-lg md:text-xl leading-relaxed text-muted-foreground"
            >
                Stop overpaying on electricity and gas. Instantly compare live tariffs, discover your cheapest options, and switch effortlessly — all with real-time pricing powered by UtilityKing’s smart engine.
            </motion.p>

            <motion.div
                variants={formVariants}
                className="mt-10 mx-auto max-w-xl"
            >
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
                    <FormField
                    control={form.control}
                    name="userInput"
                    render={({ field }) => (
                        <FormItem className="w-full">
                        <FormControl>
                            <Input
                            type="text"
                            placeholder="e.g., 'Find the cheapest deal near you'"
                            className="h-12 text-base text-foreground"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage className="text-left" />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" size="lg" className={cn("h-12 text-base font-semibold tracking-tight", !isLoading && "glowing-btn-border")} disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        'Compare Tariffs Now'
                    )}
                    </Button>
                </form>
                </Form>
                 <motion.p 
                    variants={subtitleVariants}
                    className="mt-4 text-sm text-muted-foreground"
                >
                    10,000+ households switched · Ofgem compliant · Always free to use
                </motion.p>

                {assistance && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-6 p-4 rounded-lg bg-background/20 backdrop-blur-sm text-left"
                >
                    <p className="text-sm font-medium text-foreground">{assistance.aiResponse}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                    {assistance.suggestedServices.map(service => (
                        <Button key={service} asChild size="sm" variant="secondary">
                        <Link href="#services">{service}</Link>
                        </Button>
                    ))}
                    </div>
                </motion.div>
                )}
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
