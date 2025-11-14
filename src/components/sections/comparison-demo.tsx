
"use client";

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntelligentUtilityComparisonOutput, intelligentUtilityComparison } from '@/ai/flows/intelligent-utility-comparison';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, Zap, Wifi, Smartphone, Loader2, Sparkles, Home, Building, Factory, Users, Flame, Bolt, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type ComparisonDemoProps = {
  id: string;
};

const iconMap: { [key: string]: React.ReactNode } = {
  "Energy": <Zap className="h-5 w-5 text-amber-500" />,
  "Broadband": <Wifi className="h-5 w-5 text-blue-500" />,
  "Mobile": <Smartphone className="h-5 w-5 text-green-500" />,
};

const analysisLines = [
  "Analyzing 174 active tariffs in your region...",
  "Matching to your preferences...",
  "Identifying cheapest deals...",
];

const wizardSteps = [
    {
        step: 1,
        key: 'homeType',
        title: "Your Home Setup",
        aiMessage: "What best describes your home?",
        options: [
            { label: "Small Home", description: "1-2 beds", icon: Home },
            { label: "Medium Home", description: "3 beds", icon: Home },
            { label: "Large Home", description: "4+ beds", icon: Home },
        ],
        customOption: { label: "Custom", description: "Enter exact details" },
    },
    {
        step: 2,
        key: 'occupants',
        title: "People in the Home",
        aiMessage: "How many people live in your home?",
        options: [
            { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5+" }
        ],
    },
    {
        step: 3,
        key: 'heatingType',
        title: "Your Heating Type",
        aiMessage: "How do you heat your home?",
        options: [
            { label: "Gas heating", icon: Flame },
            { label: "Electric heating", icon: Bolt },
            { label: "Mixed", icon: Info },
            { label: "Not sure", icon: Info },
        ],
    },
    {
        step: 4,
        key: 'currentSupplier',
        title: "Current Energy Supplier",
        aiMessage: "Who supplies your energy right now?",
        options: [
            { label: "Octopus" }, { label: "British Gas" }, { label: "EDF" },
            { label: "E.ON Next" }, { label: "Ovo" }, { label: "Scottish Power" },
        ],
        customOption: { label: "Other", description: "" },
    },
    {
        step: 5,
        key: 'tariffDetails',
        title: "Tariff Details",
        aiMessage: "Do you know your current tariff name?",
        options: [
            { label: "Yes, I know it" },
            { label: "No" },
        ],
    },
    {
        step: 6,
        key: 'usageMethod',
        title: "Usage Method",
        aiMessage: "What do you know about your usage?",
        options: [
            { label: "Annual usage (kWh)" },
            { label: "Monthly bill amount (£)" },
            { label: "I'm not sure" },
        ],
    },
    {
        step: 7,
        key: 'preferences',
        title: "Your Preferences",
        aiMessage: "What matters most to you? (select up to 3)",
        options: [
            { label: "Cheapest price" }, { label: "Fixed price stability" }, { label: "Flexible plans (no exit fees)" },
            { label: "100% renewable" }, { label: "Smart meter compatible" }, { label: "Low standing charge" }, { label: "Fast switching" }
        ],
        isMultiSelect: true,
    },
    {
        step: 8,
        key: 'postcode',
        title: "Postcode",
        aiMessage: "What's your postcode?",
        isInput: true,
        customPlaceholder: "e.g., M1 1AA",
    },
    {
        step: 9,
        key: 'summary',
        title: "AI Summary Review",
        aiMessage: "Great — here’s what I’ve learned about your home…",
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
  const [selections, setSelections] = useState<{ [key: string]: any }>({});
  const [customValues, setCustomValues] = useState<{ [key: string]: string }>({});
  const [isTyping, setIsTyping] = useState(true);

  React.useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), AI_TYPING_DELAY);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      handleNextStep();
    } else if (event.key === 'ArrowLeft') {
      handlePrevStep();
    }
  };

  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => handleKeyDown(e as any);
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [currentStep, selections]);


  const handleSelect = (stepKey: string, option: string) => {
    const currentWizardStep = wizardSteps[currentStep];
    const isMulti = currentWizardStep.isMultiSelect;

    let newSelections;

    if (isMulti) {
        const currentSelection = selections[stepKey] || [];
        if (currentSelection.includes(option)) {
            newSelections = { ...selections, [stepKey]: currentSelection.filter((item: string) => item !== option) };
        } else if (currentSelection.length < 3) {
            newSelections = { ...selections, [stepKey]: [...currentSelection, option] };
        } else {
            toast({ title: "You can select up to 3 preferences." });
            return;
        }
    } else {
        newSelections = { ...selections, [stepKey]: option };
    }
    
    setSelections(newSelections);

    if (!isMulti && option !== (currentWizardStep.customOption?.label || '')) {
        setTimeout(() => {
            handleNextStep();
        }, 300);
    }
  };
  
  const handleCustomValueChange = (stepKey: string, value: string) => {
    setCustomValues(prev => ({...prev, [stepKey]: value}));
    if (wizardSteps[currentStep].isInput) {
        setSelections(prev => ({...prev, [stepKey]: value}));
    }
  }

  const handleNextStep = () => {
    if (currentStep < wizardSteps.length - 1 && isStepComplete(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  const isStepComplete = (stepIndex: number) => {
    const step = wizardSteps[stepIndex];
    const selection = selections[step.key];
    if (step.key === 'summary') return true;
    if (!selection) return false;

    if (step.isMultiSelect) {
        return selection.length > 0;
    }
    if (step.customOption && selection === step.customOption.label) {
      return !!customValues[step.key];
    }
    if (step.isInput) {
        return !!selections[step.key];
    }
    return true;
  }

  const handleFormSubmit = async () => {
    setIsLoading(true);
    setComparisonResult(null);

    const mappedValues = {
        usageData: `Home Type: ${selections['homeType'] || 'Not specified'}, Occupants: ${selections['occupants'] || 'Not specified'}, Heating: ${selections['heatingType'] || 'Not specified'}`,
        preferences: `Preferences: ${(selections['preferences'] || []).join(', ') || 'Cheapest'}, Current Supplier: ${selections['currentSupplier'] || 'Not specified'}, Tariff: ${selections['tariffDetails'] === 'Yes, I know it' ? customValues['tariffDetails'] : 'Unknown'}`,
        location: selections['postcode'] || 'London'
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

  const progress = ((currentStep) / (wizardSteps.length - 1)) * 100;
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

        <div className="flex items-start justify-center gap-12">
            <div className={cn("w-full max-w-2xl", comparisonResult && !isLoading ? "lg:col-span-3" : "")}>
                <div className="relative rounded-2xl p-6 sm:p-8 bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/25 shadow-lg">
                    
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                        aria-label="Previous step"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextStep}
                        disabled={!isStepComplete(currentStep) || currentStep === wizardSteps.length - 1}
                        aria-label="Next step"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

                    {currentStep !== (wizardSteps.length - 1) && (
                        <div className="mb-6 text-center">
                            <p className="text-base font-medium text-foreground mb-2">Step {currentWizardStep.step} of {wizardSteps.length-1} &mdash; {currentWizardStep.title}</p>
                            <div className="w-full bg-primary/10 rounded-full h-2">
                                <motion.div 
                                    className="bg-primary h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%`}}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            </div>
                        </div>
                    )}

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
                                        <p className="text-lg font-semibold text-card-foreground">
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
                                        {currentStep === wizardSteps.length - 1 ? (
                                            <Card className="text-left bg-background/50 p-4">
                                                <CardContent className="space-y-2 text-sm p-0">
                                                    {Object.entries(selections).map(([key, value]) => {
                                                        const step = wizardSteps.find(s => s.key === key);
                                                        if (!step || !value) return null;
                                                        const displayValue = Array.isArray(value) ? value.join(', ') : value;
                                                        return (
                                                            <div key={key}>
                                                                <span className="font-semibold">{step.title}: </span>
                                                                <span className="text-muted-foreground">{displayValue}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <>
                                                <div className={cn("grid grid-cols-1 gap-3", currentWizardStep.options.length > 2 && "sm:grid-cols-2")}>
                                                    {currentWizardStep.options.map(option => {
                                                        const Icon = (option as any).icon;
                                                        const isSelected = currentWizardStep.isMultiSelect 
                                                            ? (selections[currentWizardStep.key] || []).includes(option.label)
                                                            : selections[currentWizardStep.key] === option.label;

                                                        return (
                                                            <motion.button
                                                                key={option.label}
                                                                variants={pillVariants}
                                                                whileHover="hover"
                                                                whileTap="tap"
                                                                onClick={() => handleSelect(currentWizardStep.key, option.label)}
                                                                className={cn(
                                                                    "p-3 text-center rounded-lg border text-base font-medium transition-all duration-200",
                                                                    isSelected
                                                                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                                        : "bg-background/50 hover:border-primary hover:bg-primary/5"
                                                                )}
                                                            >
                                                                <div className="flex items-center justify-center gap-2">
                                                                    {Icon && <Icon className="h-5 w-5" />}
                                                                    <span className="font-semibold">{option.label}</span>
                                                                </div>
                                                                {(option as any).description && <span className="text-sm block text-muted-foreground">{(option as any).description}</span>}
                                                            </motion.button>
                                                        )
                                                    })}
                                                    {currentWizardStep.customOption && (
                                                        <motion.button
                                                             key="custom"
                                                             variants={pillVariants}
                                                             whileHover="hover"
                                                             whileTap="tap"
                                                            onClick={() => handleSelect(currentWizardStep.key, currentWizardStep.customOption.label)}
                                                            className={cn(
                                                                "p-3 text-center rounded-lg border text-base font-medium transition-all duration-200",
                                                                currentWizardStep.options.length % 2 !== 0 && "sm:col-span-2",
                                                                selections[currentWizardStep.key] === currentWizardStep.customOption.label
                                                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                                    : "bg-background/50 hover:border-primary hover:bg-primary/5"
                                                            )}
                                                        >
                                                           <span className="font-semibold">{currentWizardStep.customOption.label}</span>
                                                            {currentWizardStep.customOption.description && <span className="text-sm block text-muted-foreground">{currentWizardStep.customOption.description}</span>}
                                                        </motion.button>
                                                    )}
                                                </div>

                                                {( (currentWizardStep.customOption && selections[currentWizardStep.key] === currentWizardStep.customOption.label) || currentWizardStep.isInput || (currentWizardStep.key === 'tariffDetails' && selections[currentWizardStep.key] === 'Yes, I know it')) && (
                                                  <motion.div initial={{opacity:0, height: 0}} animate={{opacity:1, height: 'auto'}} transition={{duration: 0.3}} className="space-y-3">
                                                    <Input 
                                                        placeholder={currentWizardStep.customPlaceholder || `Enter ${currentWizardStep.title}`}
                                                        className="h-12 text-base text-center"
                                                        value={customValues[currentWizardStep.key] || ''}
                                                        onChange={(e) => handleCustomValueChange(currentWizardStep.key, e.target.value)}
                                                    />
                                                     { (customValues[currentWizardStep.key] || (currentWizardStep.isInput && selections[currentWizardStep.key])) && (
                                                      <Button size="lg" className="w-full h-12 text-base" onClick={handleNextStep}>Next Step &rarr;</Button>
                                                    )}
                                                  </motion.div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {currentStep === wizardSteps.length -1 && !isLoading && !comparisonResult && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.3}}>
                            <Button 
                                size="lg"
                                className="w-full mt-6 text-lg h-12 glowing-btn-border font-semibold" 
                                onClick={handleFormSubmit}
                            >
                                Show My Best Deals &rarr;
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
                <div className="lg:col-span-2 w-full max-w-3xl">
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
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-2">
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
