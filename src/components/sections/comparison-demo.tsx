
"use client";

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntelligentUtilityComparisonOutput, intelligentUtilityComparison } from '@/ai/flows/intelligent-utility-comparison';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Zap, Wifi, Smartphone, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

type ComparisonDemoProps = {
  id: string;
};

const iconMap: { [key: string]: React.ReactNode } = {
  "Energy": <Zap className="h-5 w-5 text-amber-500" />,
  "Broadband": <Wifi className="h-5 w-5 text-blue-500" />,
  "Mobile": <Smartphone className="h-5 w-5 text-green-500" />,
};

const analysisLines = [
  "Connecting to tariff database...",
  "Fetching supplier data...",
  "Running optimization model...",
  "Evaluating 34,512 possible combinations...",
];

const wizardSteps = [
    {
        step: 1,
        title: "Your Usage",
        key: 'usage',
        aiMessage: "Tell me about your home size. This helps us estimate your energy demand accurately.",
        options: [
            { label: "Small Home", description: "1–2 bedrooms, light usage" },
            { label: "Medium Home", description: "3 bedrooms, moderate usage" },
            { label: "Large Home", description: "4+ bedrooms, heavy usage" }
        ],
        customOption: { label: "Custom", description: "Enter exact usage details" },
        customPlaceholder: "e.g., 3-bed house, family of 4, electric heating"
    },
    {
        step: 2,
        title: "Your Preferences",
        key: 'preferences',
        aiMessage: "What's most important to you? Cheapest rates, green energy, or a fixed plan?",
        options: [
            { label: "Cheapest", description: "Prioritize lowest cost" },
            { label: "Green Energy", description: "100% renewable sources" },
            { label: "Fixed Plan", description: "Lock in your rate" },
        ],
        customOption: { label: "Custom", description: "e.g., 'cheapest fixed green'" },
        customPlaceholder: "e.g., 'no exit fees, 12 month fixed'"
    },
    {
        step: 3,
        title: "Your Location",
        key: 'location',
        aiMessage: "Finally, where are you located? This helps us find deals specific to your area.",
        options: [],
        customOption: null,
        customPlaceholder: "e.g., Manchester, M1 1AA"
    },
];

const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } }
};

const pillVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, y: -2, boxShadow: '0px 5px 15px hsla(var(--primary), 0.2)' },
  tap: { scale: 0.95 }
};

const AI_TYPING_DELAY = 1000;

export default function ComparisonDemo({ id }: ComparisonDemoProps) {
  const [comparisonResult, setComparisonResult] = useState<IntelligentUtilityComparisonOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<{ [key: string]: string }>({});
  const [customValues, setCustomValues] = useState<{ [key: string]: string }>({});
  const [isTyping, setIsTyping] = useState(true);

  React.useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), AI_TYPING_DELAY);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleSelect = (stepKey: string, option: string) => {
    const newSelections = { ...selections, [stepKey]: option };
    setSelections(newSelections);

    if (option !== 'Custom' && stepKey !== 'location') {
        setTimeout(() => {
            if (currentStep < wizardSteps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        }, 300);
    }
  };
  
  const handleCustomValueChange = (stepKey: string, value: string) => {
    setCustomValues(prev => ({...prev, [stepKey]: value}));
  }

  const handleNextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isStepComplete = (stepIndex: number) => {
    const step = wizardSteps[stepIndex];
    const selection = selections[step.key];
    if (!selection) return false;
    if (selection === 'Custom') {
      return !!customValues[step.key];
    }
    if (step.key === 'location') {
        return !!selections[step.key];
    }
    return true;
  }

  const handleFormSubmit = async () => {
    setIsLoading(true);
    setComparisonResult(null);

    const mappedValues = {
        usageData: selections['usage'] === 'Custom' ? customValues['usage']! : selections['usage'] || 'Medium Home',
        preferences: selections['preferences'] === 'Custom' ? customValues['preferences']! : selections['preferences'] || 'Cheapest',
        location: selections['location'] || 'London'
    }

    try {
      await new Promise(resolve => setTimeout(resolve, analysisLines.length * 800 + 500));
      const result = await intelligentUtilityComparison(mappedValues);
      setComparisonResult(result);
    } catch (error) {
      console.error("Comparison failed:", error);
      toast({
        variant: "destructive",
        title: "Comparison Failed",
        description: "We couldn't generate comparisons at this time. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((currentStep + (isStepComplete(currentStep) ? 1: 0)) / wizardSteps.length) * 100;
  const currentWizardStep = wizardSteps[currentStep];

  return (
    <section id={id} className="py-16 sm:py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
            <h2 className="font-headline text-3xl tracking-tight md:text-[38px] font-bold text-foreground">
              Let’s Find Your Best Energy Deal — Instantly
            </h2>
            <p className="mx-auto mt-4 text-lg text-muted-foreground">
              Answer a few quick questions and our AI will calculate the smartest, cheapest tariff available for your home.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-12 justify-center">
            <div className={cn("w-full max-w-2xl mx-auto", comparisonResult && !isLoading ? "lg:col-span-3" : "lg:col-span-5")}>
                <div className="rounded-2xl p-6 sm:p-8 bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/25 shadow-lg">
                    {/* Progress Bar and Step Title */}
                    <div className="mb-6 text-center">
                        <p className="text-base font-medium text-foreground mb-2">Step {currentWizardStep.step} of {wizardSteps.length} &mdash; {currentWizardStep.title}</p>
                        <div className="w-full bg-primary/10 rounded-full h-2">
                            <motion.div 
                                className="bg-primary h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%`}}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    <div className="relative min-h-[300px] overflow-hidden flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                variants={stepVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="absolute w-full flex flex-col items-center text-center"
                            >
                                <div className="flex flex-col items-center text-center gap-3 mb-5">
                                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-base text-muted-foreground font-semibold text-card-foreground">
                                          {currentWizardStep.title}
                                        </p>
                                        <p className="text-base text-muted-foreground max-w-md mx-auto">
                                            {isTyping ? 
                                                <span className="animate-pulse">...</span> : 
                                                currentWizardStep.aiMessage
                                            }
                                        </p>
                                    </div>
                                </div>
                                
                                {!isTyping && (
                                    <div className="space-y-3 w-full max-w-md">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {currentWizardStep.options.map(option => (
                                                <motion.button
                                                    key={option.label}
                                                    variants={pillVariants}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                    onClick={() => handleSelect(currentWizardStep.key, option.label)}
                                                    className={cn(
                                                        "p-3 text-center rounded-lg border text-base font-medium transition-all duration-200",
                                                        selections[currentWizardStep.key] === option.label
                                                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                            : "bg-background/50 hover:border-primary hover:bg-primary/5"
                                                    )}
                                                >
                                                    <span className="font-semibold">{option.label}</span>
                                                    <span className="text-sm block text-muted-foreground">{option.description}</span>
                                                </motion.button>
                                            ))}
                                            {currentWizardStep.customOption && (
                                                <motion.button
                                                     key="custom"
                                                     variants={pillVariants}
                                                     whileHover="hover"
                                                     whileTap="tap"
                                                    onClick={() => handleSelect(currentWizardStep.key, 'Custom')}
                                                    className={cn(
                                                        "p-3 text-center rounded-lg border text-base font-medium transition-all duration-200",
                                                        currentWizardStep.options.length % 2 !== 0 ? "sm:col-span-2" : "",
                                                        selections[currentWizardStep.key] === 'Custom'
                                                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                            : "bg-background/50 hover:border-primary hover:bg-primary/5"
                                                    )}
                                                >
                                                   <span className="font-semibold">{currentWizardStep.customOption.label}</span>
                                                    <span className="text-sm block text-muted-foreground">{currentWizardStep.customOption.description}</span>
                                                </motion.button>
                                            )}
                                        </div>

                                        {selections[currentWizardStep.key] === 'Custom' && currentWizardStep.key !== 'location' && (
                                          <motion.div initial={{opacity:0, height: 0}} animate={{opacity:1, height: 'auto'}} transition={{duration: 0.3}}>
                                            <Input 
                                                placeholder={currentWizardStep.customPlaceholder}
                                                className="h-12 text-base text-center"
                                                value={customValues[currentWizardStep.key] || ''}
                                                onChange={(e) => handleCustomValueChange(currentWizardStep.key, e.target.value)}
                                            />
                                          </motion.div>
                                        )}

                                         {currentWizardStep.key === 'location' && (
                                            <Input 
                                                placeholder={currentWizardStep.customPlaceholder}
                                                className="h-12 text-base text-center"
                                                value={selections['location'] || ''}
                                                onChange={(e) => handleSelect('location', e.target.value)}
                                            />
                                        )}
                                        {isStepComplete(currentStep) && currentStep < wizardSteps.length -1 && (
                                            <Button size="lg" className="w-full h-12 text-base" onClick={handleNextStep}>Next Step &rarr;</Button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {isStepComplete(0) && isStepComplete(1) && isStepComplete(2) && !isLoading && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.3}}>
                            <Button 
                                size="lg"
                                className="w-full mt-6 text-lg h-12 glowing-btn-border font-semibold" 
                                onClick={handleFormSubmit}
                            >
                                Calculate My Savings
                            </Button>
                        </motion.div>
                    )}
                    {isLoading && (
                         <div
                            className="flex flex-col items-center justify-center min-h-[150px] p-8"
                          >
                            <div className="relative h-20 w-full max-w-sm overflow-hidden text-left font-code">
                                {analysisLines.map((line, index) => (
                                  <motion.p
                                    key={line}
                                    custom={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.8, duration: 0.5 } }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute inset-0 text-sm text-muted-foreground"
                                  >
                                    {`> ${line}`}
                                  </motion.p>
                                ))}
                            </div>

                          </div>
                    )}
                </div>
            </div>

            {comparisonResult && !isLoading && (
                <div className="lg:col-span-2 w-full">
                    <AnimatePresence>
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:mt-0 mt-8"
                    >
                        <div className='text-left mb-4'>
                            <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary">Your Cheapest Energy Deals</h3>
                            <p className='text-muted-foreground'>{comparisonResult.comparisonSummary}</p>
                        </div>

                        <Carousel opts={{ align: "start" }} className="w-full mt-6">
                        <CarouselContent className="-ml-2">
                            {comparisonResult.recommendedPlans.map((plan, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 pl-2">
                                <motion.div
                                    custom={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={(i) => ({
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.5 + i * 0.12, ease: "easeOut" }
                                    })}
                                >
                                    <Card className="flex flex-col h-full bg-card border-border hover:border-primary/80 hover:shadow-lg transition-all hover:-translate-y-1">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Badge variant="secondary" className="mb-2">{plan.provider}</Badge>
                                                <CardTitle className="text-lg font-semibold text-foreground">{plan.planName}</CardTitle>
                                            </div>
                                            {iconMap[plan.provider] || <Zap className="h-5 w-5 text-amber-500" />}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-2">
                                        <div className="font-headline text-3xl md:text-[40px] font-bold text-foreground tracking-tight">
                                            £{plan.price.toFixed(2)}
                                            <span className="text-base font-normal text-muted-foreground">/year</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Contract: <span className="font-semibold text-card-foreground">{plan.contractLength}</span>
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold">
                                            <Link href={plan.link} target="_blank">Switch & Start Saving Today <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                        </Button>
                                    </CardFooter>
                                    </Card>
                                </motion.div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex -left-4" />
                        <CarouselNext className="hidden sm:flex -right-4" />
                        </Carousel>
                    </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </div>
      </div>
    </section>
  );
}

    