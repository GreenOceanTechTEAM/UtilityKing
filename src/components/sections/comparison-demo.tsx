
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntelligentUtilityComparisonOutput, intelligentUtilityComparison } from '@/ai/flows/intelligent-utility-comparison';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, Zap, Loader2, Sparkles, Home, Building, Factory, Users, Flame, ChevronLeft, ChevronRight, UploadCloud, CornerDownLeft } from 'lucide-react';
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
  "Broadband": <Zap className="h-5 w-5 text-blue-500" />,
  "Mobile": <Zap className="h-5 w-5 text-green-500" />,
};

const analysisLines = [
  "Analyzing 174 active tariffs in your region...",
  "Matching to your preferences...",
  "Identifying cheapest deals...",
];

const wizardSteps = [
    {
        step: 1,
        key: 'premisesType',
        title: "Premises Type",
        aiMessage: "What type of premises do you want to compare?",
        options: [
            { label: "Home", icon: Home },
            { label: "Office", icon: Building },
            { label: "Factory", icon: Factory },
            { label: "Other", description: "e.g. Farm, Ranch", customOption: true },
        ],
    },
    {
        step: 2,
        key: 'usesHeating',
        title: "Heating Usage",
        aiMessage: "Does your premises use heating?",
        options: [{ label: "Yes" }, { label: "No" }],
    },
    {
        step: 3,
        key: 'occupantsCategory',
        title: "Occupants",
        aiMessage: "How many people use this premises?",
        options: [{ label: "Under 5" }, { label: "Over 5" }],
        skipIf: (selections: any) => selections.premisesType === 'Factory',
    },
    {
        step: 4,
        key: 'electricitySupplier',
        title: "Electricity Supplier",
        aiMessage: "Who is your electricity supplier?",
        options: [
            { label: "Octopus Energy" }, { label: "British Gas" }, { label: "EDF Energy" },
            { label: "E.ON Next" }, { label: "Ovo Energy" }, { label: "Scottish Power" },
            { label: "Shell Energy" }, { label: "SSE (Ovo)" }, { label: "So Energy" },
            { label: "Ecotricity" }, { label: "Green Energy UK" }, { label: "Good Energy" },
            { label: "Utility Warehouse" }, { label: "Outfox the Market" }, { label: "Boost" },
            { label: "Co-op Energy" }, { label: "Bulb (legacy)"}, { label: "Utilita" },
        ],
        additionalOptions: ["I Don’t Know"]
    },
    {
        step: 5,
        key: 'usageInputType',
        title: "Energy Usage",
        aiMessage: "How do you want to provide your energy usage?",
        options: [
            { label: "Consumption (kWh)" },
            { label: "Monthly Amount (£)" },
        ],
    },
    {
        step: 6,
        key: 'usageInputRaw',
        title: "Energy Usage",
        aiMessage: "Enter your energy usage details.",
        isInput: true,
        options: [],
        skipIf: (selections: any) => !selections.usageInputType,
    },
    {
        step: 7,
        key: 'billAvailable',
        title: "Bill Available",
        aiMessage: "Do you have your bill handy?",
        options: [{ label: "Yes" }, { label: "No" }],
    },
    {
        step: 8,
        key: 'preferences',
        title: "Your Preferences",
        aiMessage: "What matters most to you?",
        options: [
            { label: "Cheapest price" }, { label: "Fixed rate contract" }, { label: "Flexible / no exit fees" },
            { label: "100% renewable" }, { label: "Smart meter compatible" }, { label: "Fastest switching" }
        ],
        isMultiSelect: true,
    },
    {
        step: 9,
        key: 'postcode',
        title: "Postcode",
        aiMessage: "What’s your postcode?",
        isInput: true,
        customPlaceholder: "e.g., M1 1AA",
        options: [],
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
  const [isTyping, setIsTyping] = useState(true);

  const activeWizardSteps = React.useMemo(() => {
    return wizardSteps.filter(step => !step.skipIf || !step.skipIf(selections));
  }, [selections]);

  const currentVisibleStepIndex = activeWizardSteps.findIndex(step => step.step === wizardSteps[currentStep]?.step);

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), AI_TYPING_DELAY);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNextStep = () => {
    let nextStepIndex = currentStep + 1;
    while (nextStepIndex < wizardSteps.length && wizardSteps[nextStepIndex].skipIf && wizardSteps[nextStepIndex].skipIf!(selections)) {
      nextStepIndex++;
    }
    if (nextStepIndex < wizardSteps.length) {
      setCurrentStep(nextStepIndex);
    }
  };

  const handlePrevStep = () => {
    let prevStepIndex = currentStep - 1;
    while (prevStepIndex >= 0 && wizardSteps[prevStepIndex].skipIf && wizardSteps[prevStepIndex].skipIf!(selections)) {
      prevStepIndex--;
    }
    if (prevStepIndex >= 0) {
      setCurrentStep(prevStepIndex);
    }
  };

  const handleSelect = (stepKey: string, option: string) => {
    const currentWizardStep = wizardSteps[currentStep];
    const isMulti = currentWizardStep.isMultiSelect;

    let newSelections;

    if (isMulti) {
        const currentSelection = selections[stepKey] || [];
        if (currentSelection.includes(option)) {
            newSelections = { ...selections, [stepKey]: currentSelection.filter((item: string) => item !== option) };
        } else {
            newSelections = { ...selections, [stepKey]: [...currentSelection, option] };
        }
    } else {
        newSelections = { ...selections, [stepKey]: option };
    }
    
    setSelections(newSelections);

    if (!isMulti && currentWizardStep.key !== 'billAvailable') {
        setTimeout(() => {
            handleNextStep();
        }, 300);
    } else if (currentWizardStep.key === 'billAvailable' && option === 'No') {
        setTimeout(() => {
            handleNextStep();
        }, 300);
    }
  };
  
  const handleCustomValueChange = (stepKey: string, value: string) => {
    setSelections(prev => ({...prev, [stepKey]: value}));
  }

  const handleCustomSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNextStep();
    }
  };

  const isStepComplete = (stepIndex: number) => {
    const step = wizardSteps[stepIndex];
    if (!step) return false;
    
    const selection = selections[step.key];

    if (step.isMultiSelect) {
        return selection && selection.length > 0;
    }
    
    if (step.isInput) {
        return !!selection;
    }
    
    if(step.additionalOptions?.includes(selection)) {
        return true;
    }

    return !!selection;
  }

  const handleFormSubmit = async () => {
    setIsLoading(true);
    setComparisonResult(null);

    const mappedValues = {
        usageData: selections['usageInputRaw'] || 'Not specified',
        preferences: `Preferences: ${(selections['preferences'] || []).join(', ') || 'Cheapest'}. Premises: ${selections['premisesType']}, Occupants: ${selections['occupantsCategory']}`,
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

  const progress = ((currentVisibleStepIndex + 1) / (activeWizardSteps.length)) * 100;
  const currentWizardStep = wizardSteps[currentStep];

  const getPlaceholderForUsage = () => {
    if (selections.usageInputType === 'Consumption (kWh)') {
        return "e.g., 2700 kWh/year";
    }
    if (selections.usageInputType === 'Monthly Amount (£)') {
        return "e.g., £75 per month";
    }
    return "e.g., 2700 kWh/year or £75 per month";
  }

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
            <div className="w-full max-w-[560px]">
                <div className="relative rounded-2xl p-6 sm:p-8 bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/25 shadow-lg">
                    
                    <div className="absolute top-4 right-4 z-10 flex gap-2 items-center">
                      <Button variant="ghost" size="icon" onClick={handlePrevStep} disabled={currentStep === 0} aria-label="Previous step">
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <span className="text-sm font-medium text-muted-foreground">Step {currentVisibleStepIndex + 1} of {activeWizardSteps.length}</span>
                      <Button variant="ghost" size="icon" onClick={handleNextStep} disabled={!isStepComplete(currentStep) || currentStep >= wizardSteps.length -1} aria-label="Next step">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="w-full bg-primary/10 rounded-full h-1 mb-6">
                        <motion.div 
                            className="bg-primary h-1 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%`}}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="relative min-h-[300px] overflow-hidden flex flex-col items-center">
                        <AnimatePresence mode="wait">
                            {currentWizardStep &&
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
                                        <div className={cn(
                                          "grid grid-cols-1 gap-3",
                                          currentWizardStep.options.length > 1 && ![4, 8].includes(currentWizardStep.step) && "sm:grid-cols-2",
                                          currentWizardStep.step === 4 && "max-h-[260px] overflow-y-auto pr-2 sm:grid-cols-2",
                                          currentWizardStep.step === 8 && "sm:grid-cols-2"
                                          )}>
                                            {currentWizardStep.options.map(option => {
                                                const Icon = (option as any).icon;
                                                const isSelected = currentWizardStep.isMultiSelect 
                                                    ? (selections[currentWizardStep.key] || []).includes(option.label)
                                                    : selections[currentWizardStep.key] === option.label;

                                                const isCustomOptionSelected = isSelected && option.customOption;

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
                                             {currentWizardStep.additionalOptions?.map(option => (
                                                <motion.button
                                                    key={option}
                                                    variants={pillVariants}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                    onClick={() => handleSelect(currentWizardStep.key, option)}
                                                     className={cn(
                                                        "p-3 text-center rounded-lg border text-base font-medium transition-all duration-200 sm:col-span-2",
                                                        selections[currentWizardStep.key] === option
                                                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                            : "bg-background/50 hover:border-primary hover:bg-primary/5"
                                                    )}
                                                >
                                                    {option}
                                                </motion.button>
                                            ))}
                                        </div>

                                        {currentWizardStep.key === 'billAvailable' && selections.billAvailable === 'Yes' && (
                                            <motion.div initial={{opacity:0, height: 0}} animate={{opacity:1, height: 'auto'}} className="w-full">
                                                <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary transition-colors duration-300">
                                                    <UploadCloud className="h-12 w-12 text-muted-foreground/70 mb-4" />
                                                    <p className="font-semibold text-foreground mb-1">Click to upload or drag and drop</p>
                                                    <p className="text-sm text-muted-foreground">PNG, JPG, or PDF (max 5MB)</p>
                                                    <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                                </div>
                                                <Button size="lg" className="w-full h-12 text-base mt-4" onClick={handleNextStep}>Next Step &rarr;</Button>
                                            </motion.div>
                                        )}

                                        {currentWizardStep.isInput && (
                                            <motion.div initial={{opacity:0, height: 0}} animate={{opacity:1, height: 'auto'}} transition={{duration: 0.3}} className="space-y-3">
                                            <div className="relative">
                                                <Input 
                                                    placeholder={currentWizardStep.key === 'usageInputRaw' ? getPlaceholderForUsage() : (currentWizardStep.customPlaceholder || `Enter ${currentWizardStep.title}`)}
                                                    className="h-12 text-base text-center"
                                                    value={selections[currentWizardStep.key] || ''}
                                                    onChange={(e) => handleCustomValueChange(currentWizardStep.key, e.target.value)}
                                                    onKeyDown={handleCustomSubmit}
                                                />
                                            </div>
                                            {selections[currentWizardStep.key] && currentWizardStep.step !== 9 && (
                                                <Button size="lg" className="w-full h-12 text-base" onClick={handleNextStep}>Next Step &rarr;</Button>
                                            )}
                                            </motion.div>
                                        )}

                                        {currentWizardStep.isMultiSelect && isStepComplete(currentStep) && (
                                             <motion.div initial={{opacity:0, height: 0}} animate={{opacity:1, height: 'auto'}} transition={{duration: 0.3}} className="space-y-3">
                                                <Button size="lg" className="w-full h-12 text-base" onClick={handleNextStep}>Next Step &rarr;</Button>
                                             </motion.div>
                                        )}

                                        {currentWizardStep.key === 'postcode' && isStepComplete(currentStep) && !isLoading && (
                                            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.3}}>
                                                <Button 
                                                    size="lg"
                                                    className="w-full mt-6 text-lg h-12 glowing-btn-border font-semibold" 
                                                    onClick={handleFormSubmit}
                                                >
                                                    COMPARE ENERGY DEALS &rarr;
                                                </Button>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                            }
                        </AnimatePresence>
                    </div>

                    {isLoading && (
                         <div className="flex flex-col items-center justify-center min-h-[150px] p-8">
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
        </div>
         {comparisonResult && !isLoading && (
                <div className="mt-16">
                    <AnimatePresence>
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className='text-center mb-4'>
                            <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary">Your Cheapest Energy Deals</h3>
                            <p className='text-muted-foreground max-w-2xl mx-auto'>{comparisonResult.comparisonSummary}</p>
                        </div>

                        <Carousel opts={{ align: "start" }} className="w-full mt-6 max-w-4xl mx-auto">
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
    </section>
  );
}

    