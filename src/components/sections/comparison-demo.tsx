"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { intelligentUtilityComparison, IntelligentUtilityComparisonOutput } from '@/ai/flows/intelligent-utility-comparison';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Zap, Wifi, Smartphone, ArrowRight, CheckCircle, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import TerminalCore from '../shared/terminal-core';

type ComparisonDemoProps = {
  id: string;
};

const formSchema = z.object({
  usageData: z.string().min(5, "Please describe your usage."),
  preferences: z.string().min(5, "Please describe your preferences."),
  location: z.string().min(2, "Please enter your location."),
});

type Step = 'initial' | 'usage' | 'preferences' | 'location' | 'cta' | 'analyzing' | 'results';

const TypewriterText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');
  
    useEffect(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, 50);
      return () => clearInterval(interval);
    }, [text, onComplete]);
  
    return <span>{displayedText}</span>;
};

export default function ComparisonDemo({ id }: ComparisonDemoProps) {
  const [comparisonResult, setComparisonResult] = useState<IntelligentUtilityComparisonOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>('initial');
  const [showInput, setShowInput] = useState({ usage: false, preferences: false, location: false });
  const { toast } = useToast();
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { usageData: "", preferences: "", location: "" },
  });
  
  useEffect(() => {
    if (terminalBodyRef.current) {
        terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [step, showInput]);

  useEffect(() => {
    if (step === 'initial') {
        setTimeout(() => setStep('usage'), 500);
    }
  }, [step]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setStep('analyzing');
    setIsLoading(true);
    setComparisonResult(null);
    try {
      const result = await intelligentUtilityComparison(values);
      setComparisonResult(result);
      setTimeout(() => setStep('results'), 1000); 
    } catch (error) {
      console.error("Comparison failed:", error);
      toast({
        variant: "destructive",
        title: "Comparison Failed",
        description: "We couldn't generate comparisons at this time. Please try again later.",
      });
      setStep('cta');
    } finally {
      setIsLoading(false);
    }
  }

  const iconMap: { [key: string]: React.ReactNode } = {
    "Energy": <Zap className="h-5 w-5 text-amber-500" />,
    "Broadband": <Wifi className="h-5 w-5 text-blue-500" />,
    "Mobile": <Smartphone className="h-5 w-5 text-green-500" />,
  };
  
  const renderStepContent = () => {
    return (
        <div className='font-code p-4 text-sm'>
            {step >= 'usage' && (
                <div className='mb-4'>
                    <TypewriterText text='> Initializing UKi AI... Loading preference modules... Ready.' onComplete={() => setShowInput(s => ({...s, usage: true}))}/>
                </div>
            )}
            {showInput.usage && (
                 <form onSubmit={form.handleSubmit(() => setStep('preferences'))} className="flex items-center gap-2">
                    <label htmlFor="usageData" className="flex-shrink-0">&gt; Describe your energy usage:</label>
                    <input
                        {...form.register('usageData')}
                        id="usageData"
                        autoComplete='off'
                        className="terminal-input"
                        placeholder="e.g., 3-bed house, 2 adults, heavy streaming"
                    />
                </form>
            )}
             {step > 'usage' && <p className="text-green-400/80 flex items-center gap-2 mt-1"><CheckCircle size={14}/> Usage received</p>}

             {step >= 'preferences' && (
                <div className='mt-4'>
                    <TypewriterText text='> What type of energy deals do you prefer?' onComplete={() => setShowInput(s => ({...s, preferences: true}))}/>
                </div>
             )}
            {showInput.preferences && step === 'preferences' && (
                 <form onSubmit={form.handleSubmit(() => setStep('location'))} className="flex items-center gap-2 mt-2">
                    <label htmlFor="preferences" className="flex-shrink-0">&gt;</label>
                    <input
                        {...form.register('preferences')}
                        id="preferences"
                        autoComplete='off'
                        className="terminal-input"
                        placeholder="e.g., Cheapest 12-month contract, 100% renewable"
                    />
                </form>
            )}
            {step > 'preferences' && <p className="text-green-400/80 flex items-center gap-2 mt-1"><CheckCircle size={14}/> Preferences recorded</p>}
            
            {step >= 'location' && (
                <div className='mt-4'>
                    <TypewriterText text='> Finally, enter your location (postcode or city):' onComplete={() => setShowInput(s => ({...s, location: true}))}/>
                </div>
             )}
            {showInput.location && step === 'location' && (
                 <form onSubmit={form.handleSubmit(() => setStep('cta'))} className="flex items-center gap-2 mt-2">
                    <label htmlFor="location" className="flex-shrink-0">&gt;</label>
                    <input
                        {...form.register('location')}
                        id="location"
                        autoComplete='off'
                        className="terminal-input"
                        placeholder="e.g., Manchester or M1 1AA"
                    />
                </form>
            )}
             {step > 'location' && <p className="text-green-400/80 flex items-center gap-2 mt-1"><CheckCircle size={14}/> Location confirmed</p>}

             {step >= 'cta' && (
                <div className='mt-4 flex items-center gap-2'>
                    <span>&gt; Ready to analyze?</span>
                    <Button variant="ghost" className="terminal-button" onClick={() => form.handleSubmit(onSubmit)()}>[Y/n]</Button>
                </div>
             )}
        </div>
    )
  }

  return (
    <section id={id} className="py-16 sm:py-24 terminal-bg overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute inset-0 scanlines z-0 opacity-[0.03]"></div>

            <motion.div 
                className="terminal-window-shell"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            >
                <div className="terminal-title-bar">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500 glow-red"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500 glow-yellow"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500 glow-green"></div>
                    </div>
                    <div className="text-center text-sm font-code flex-1">UKi AI Terminal v1.0 — Energy Deal Optimizer</div>
                    <div className='w-16'></div>
                </div>
                <div ref={terminalBodyRef} className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
                    <div className="border-r border-cyan-400/10">
                        {renderStepContent()}
                    </div>
                    <div className="flex items-center justify-center p-8">
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                            >
                                {step !== 'analyzing' && (
                                    <div className="text-center text-cyan-400/50 font-code">
                                        <Terminal size={48} className="mx-auto mb-4" />
                                        <p>Awaiting commands...</p>
                                    </div>
                                )}
                                {step === 'analyzing' && <TerminalCore />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

             <AnimatePresence>
                {step === 'results' && comparisonResult && (
                <motion.div
                    className="mt-12"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, staggerChildren: 0.1 }}
                >
                    <motion.div variants={{ animate: { opacity:1, y: 0 }, initial: { opacity: 0, y: 20}}} className='text-center mb-4'>
                        <h3 className="font-code text-green-400">> Analysis complete. Optimal deals identified:</h3>
                        <p className='font-code text-cyan-400/80'>> {comparisonResult.comparisonSummary}</p>
                    </motion.div>

                    <Carousel opts={{ align: "start" }} className="w-full mt-8">
                    <CarouselContent>
                        {comparisonResult.recommendedPlans.map((plan, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                             <motion.div
                                custom={index}
                                initial={{ opacity: 0, x: -50 }}
                                animate={(i) => ({
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: i * 0.15, type: 'spring', stiffness: 100 }
                                })}
                             >
                                <Card className="flex flex-col h-full bg-slate-900/50 border-primary/20 backdrop-blur-sm terminal-glow-border hover:border-accent/80 transition-colors">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Badge variant="outline" className="mb-2 border-accent/50 text-accent">{plan.provider}</Badge>
                                            <CardTitle className="text-lg font-bold text-slate-100">{plan.planName}</CardTitle>
                                        </div>
                                        {iconMap[plan.provider] || <Zap className="h-5 w-5 text-amber-500" />}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="text-3xl font-bold font-headline text-slate-50">
                                        £{plan.price.toFixed(2)}
                                        <span className="text-base font-normal text-muted-foreground">/month</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Contract: <span className="font-semibold text-slate-300">{plan.contractLength}</span>
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 glowing-btn-border">
                                        <Link href={plan.link} target="_blank">View Deal <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                    </Button>
                                </CardFooter>
                                </Card>
                            </motion.div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex bg-slate-800/50 border-accent/30 hover:bg-accent/80" />
                    <CarouselNext className="hidden sm:flex bg-slate-800/50 border-accent/30 hover:bg-accent/80" />
                    </Carousel>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    </section>
  );
}
