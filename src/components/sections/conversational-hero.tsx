
"use client";

import { useState, useEffect } from 'react';
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

const placeholders = [
    "Compare British Gas vs. Octopus...",
    "What's the cheapest fixed-rate tariff?",
    "Find a 100% renewable energy plan.",
    "Is my current plan a good deal?",
    "Show me deals with no exit fees.",
];

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
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput: "",
    },
  });
  
  useEffect(() => {
    let currentPlaceholderIndex = 0;
    let currentText = "";
    let isDeleting = false;
    let timeout: NodeJS.Timeout;

    const type = () => {
      const fullText = placeholders[currentPlaceholderIndex];
      
      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
      }

      setCurrentPlaceholder(currentText);

      let typeSpeed = isDeleting ? 50 : 120;

      if (!isDeleting && currentText === fullText) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
        typeSpeed = 500; // Pause before typing new
      }

      timeout = setTimeout(type, typeSpeed);
    };

    type();

    return () => clearTimeout(timeout);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAssistance(null);
    try {
      // This AI call is now disconnected from the main button.
      // You could re-connect it to a different button or trigger if needed.
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
  
  const headlineLines = [
    "Compare UK Energy Deals in Seconds",
    "— Switch Smarter, Save More."
  ];

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
                {headlineLines.map((line, lineIndex) => (
                  <span className="block" key={lineIndex}>
                    {line.split(" ").map((word, wordIndex) => (
                        <motion.span key={wordIndex} variants={wordVariants} className="inline-block mr-[0.25em]">
                            {word}
                        </motion.span>
                    ))}
                  </span>
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
                            placeholder={currentPlaceholder + '|'}
                            className="h-12 text-base text-foreground"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage className="text-left" />
                        </FormItem>
                    )}
                    />
                    <Button asChild size="lg" className={cn("h-12 text-base font-semibold tracking-tight glowing-btn-border")}>
                      <Link href="#compare">Compare Tariffs Now</Link>
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
