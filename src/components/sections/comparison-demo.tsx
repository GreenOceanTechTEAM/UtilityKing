
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowRight, Zap, Loader2, Sparkles, Home, Building, Factory, ChevronLeft, ChevronRight, UploadCloud, CalendarDays, Leaf, Search, User, Mail, Phone, Server, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { IntelligentUtilityComparisonOutput } from '@/ai/flows/intelligent-utility-comparison';

type ComparisonDemoProps = {
  id: string;
};

const leadSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().min(10, "Please enter a valid phone number."),
});

const iconMap: { [key: string]: React.ReactNode } = {
  "Energy": <Zap className="h-5 w-5 text-amber-500" />,
  "Broadband": <Zap className="h-5 w-5 text-blue-500" />,
  "Mobile": <Zap className="h-5 w-5 text-green-500" />,
};

const wizardSteps = [
    {
        step: 1,
        part: 1,
        key: 'premisesType',
        title: "Premises Type",
        aiMessage: "First, what type of premises do you want to compare?",
        options: [
            { label: "Home", icon: Home },
            { label: "Office", icon: Building },
            { label: "Factory", icon: Factory },
            { label: "Farm" },
            { label: "Ranch" },
            { label: "Other" },
        ],
    },
    {
        step: 2,
        part: 1,
        key: 'billAvailable',
        title: "Upload a Bill",
        aiMessage: "To be more accurate, do you have a recent bill handy?",
        options: [{ label: "Yes, I'll upload it" }, { label: "No, I'll skip" }],
    },
    {
        step: 3,
        part: 1,
        key: 'preferences',
        title: "Your Preferences",
        aiMessage: "What matters most to you in a new plan?",
        options: [
            { label: "Cheapest price" }, { label: "Fixed rate contract" }, { label: "Flexible / no exit fees" },
            { label: "Smart meter compatible" }, { label: "Fastest switching" }
        ],
        isMultiSelect: true,
    },
    {
        step: 4,
        part: 1,
        key: 'renewablePreference',
        title: "Renewable Energy",
        aiMessage: "Do you prefer tariffs from 100% renewable energy suppliers?",
        options: [{ label: "Yes", icon: Leaf }, { label: "No" }],
    },
    {
        step: 5,
        part: 2,
        key: 'postcode',
        title: "Postcode",
        aiMessage: "What’s your postcode?",
        isInput: true,
        customPlaceholder: "e.g., M1 1AA",
        options: [],
        icon: Search,
    },
    {
        step: 6,
        part: 2,
        key: 'electricitySupplier',
        title: "Current Supplier",
        aiMessage: "Who is your current electricity supplier?",
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
        step: 7,
        part: 2,
        key: 'usage',
        title: "Energy Usage",
        aiMessage: "What's your yearly consumption in kWh?",
        isInput: true,
        customPlaceholder: "e.g., 2700 kWh/year",
        options: [],
    },
    {
        step: 8,
        part: 2,
        key: 'contractEndDate',
        title: "Contract End Date",
        aiMessage: "When does your current contract end?",
        isInput: true,
        inputType: "date",
        customPlaceholder: "Select a date",
        icon: CalendarDays,
        options: [],
    },
];

const analysisLines = [
    'Analyzing your postcode...',
    'Comparing market tariffs...',
    'Checking supplier rates...',
    'Finalizing recommendations...',
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
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSavingLead, setIsSavingLead] = useState(false);
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<{ [key: string]: any }>({});
  const [isTyping, setIsTyping] = useState(true);
  
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
        setConnectionStatus('checking');
        setConnectionError(null);
        try {
            const response = await fetch('/api/webhook-proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ requestData: {} }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Connection test failed: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            if(data) {
                setConnectionStatus('success');
            } else {
                 throw new Error("Received an empty or invalid response from server.");
            }

        } catch (error: any) {
            setConnectionStatus('error');
            setConnectionError(error.message || 'An unknown error occurred while connecting to the comparison service.');
        }
    };

    checkConnection();
  }, []);

  const activeWizardSteps = React.useMemo(() => {
    return wizardSteps;
  }, []);
  
  const leadForm = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  const currentWizardStepConfig = wizardSteps[currentStep];
  const currentPart = currentWizardStepConfig?.part || 1;

  const totalParts = Math.max(...wizardSteps.map(s => s.part));
  
  const stepsInCurrentPart = activeWizardSteps.filter(s => s.part === currentPart).length;
  const currentStepWithinPart = activeWizardSteps.filter(s => s.part === currentPart && s.step <= currentWizardStepConfig.step).length;


  useEffect(() => {
    if (connectionStatus === 'success') {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), AI_TYPING_DELAY);
        return () => clearTimeout(timer);
    }
  }, [currentStep, connectionStatus]);

  const handleNextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelect = (stepKey: string, option: string) => {
    const isMulti = currentWizardStepConfig.isMultiSelect;

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
    
    const stepConfig = wizardSteps.find(s => s.key === stepKey);
    if (stepConfig && !stepConfig.isMultiSelect && !stepConfig.isInput) {
        setTimeout(() => handleNextStep(), 300);
    }
  };
  
  const handleCustomValueChange = (stepKey: string, value: string) => {
    setSelections(prev => ({...prev, [stepKey]: value}));
  }

  const handleCustomSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(isStepComplete(currentStep)){
        handlePrimaryAction();
      }
    }
  };

  const isStepComplete = (stepIndex: number) => {
    const step = wizardSteps[stepIndex];
    if (!step) return false;
    
    const selection = selections[step.key];

    if (step.isMultiSelect) {
        return selection && selection.length > 0;
    }
    
    if (step.key === 'contractEndDate') {
        return !!selection;
    }
    
    return !!selection;
  }

  const handleFormSubmit = async () => {
    setIsLoading(true);
    setComparisonResult(null);

    const formData = {
      postcode: selections['postcode'] || '',
      supplier: selections['electricitySupplier'] || '',
      usage: selections['usage'] || '',
      endDate: selections['contractEndDate'] || '',
    };
    
    console.log('Sending data to proxy:', formData);
  
    try {
        const response = await fetch('/api/webhook-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ requestData: formData }),
        });
  
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed with status: ${response.status}. Response: ${errorText}`);
        }
  
        const resultData = await response.json();
        // The data is doubly stringified, so we need to parse it twice.
        // First parse is for the Next.js response, second is for the nested JSON from .NET.
        const parsedInnerJson = JSON.parse(resultData.d);
        
        const finalResult: IntelligentUtilityComparisonOutput = {
            comparisonSummary: "Here are your personalized results based on the latest market data.",
            recommendedPlans: parsedInnerJson.recommendedPlans || parsedInnerJson,
        };
  
        setComparisonResult(finalResult);
  
    } catch (error: any) {
        console.error("Comparison failed:", error);
        toast({
            variant: "destructive",
            title: "Comparison Failed",
            description: `We couldn't generate comparisons at this time. ${error.message}`,
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handlePrimaryAction = () => {
    if (currentStep === wizardSteps.length - 1 && isStepComplete(currentStep)) {
      setIsLeadModalOpen(true);
    } else if (isStepComplete(currentStep)) {
      handleNextStep();
    }
  };

  async function onLeadSubmit(values: z.infer<typeof leadSchema>) {
    if (!firestore) {
      toast({ variant: "destructive", title: "Connection Error", description: "Could not connect to the database." });
      return;
    }
    
    setIsSavingLead(true);
    
    const leadData = {
      ...values,
      comparisonInputs: selections,
      createdAt: serverTimestamp(),
    };
    
    try {
      const leadsCollection = collection(firestore, 'comparison_leads');
      await addDoc(leadsCollection, leadData);

      toast({ title: "Information Saved!", description: "Generating your personalized results now." });
      
      setIsLeadModalOpen(false);
      handleFormSubmit();
    } catch (error) {
      console.error("Error saving lead:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "We couldn't save your information. Please try again.",
      });
    } finally {
      setIsSavingLead(false);
    }
  }

  const progress = (currentStepWithinPart / stepsInCurrentPart) * 100;

  const getButtonText = () => {
    if (currentStep < wizardSteps.length - 1) {
      return "Next Step";
    }
    return "Compare Energy Deals";
  }

  const renderConnectionStatus = () => (
     <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        {connectionStatus === 'checking' && (
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Checking connection to comparison service...</span>
            </div>
        )}
        {connectionStatus === 'success' && (
            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="flex flex-col items-center gap-3 text-green-600">
                <CheckCircle className="h-10 w-10" />
                <span className="font-semibold">Connection Successful!</span>
                <p className="text-sm text-muted-foreground">The comparison wizard will now start.</p>
            </motion.div>
        )}
        {connectionStatus === 'error' && (
            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md">
                <div className="flex items-center gap-3 text-destructive font-semibold">
                    <AlertTriangle className="h-6 w-6" />
                    <p>Connection Failed</p>
                </div>
                <p className="mt-2 text-sm text-left text-destructive/80">
                    We could not establish a connection to the comparison service. This may be a temporary issue. Please try again later.
                </p>
                 {connectionError && <pre className="mt-2 text-xs whitespace-pre-wrap break-all bg-destructive/5 p-2 rounded text-left">{connectionError}</pre>}
            </motion.div>
        )}
     </div>
  );

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
                <div className="relative rounded-2xl p-6 sm:p-8 bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/25 shadow-lg min-h-[550px]">
                    
                    {connectionStatus !== 'success' && renderConnectionStatus()}
                    
                    {connectionStatus === 'success' && !isLoading && !comparisonResult && (
                        <>
                            <div className="absolute top-4 right-4 z-10 flex gap-2 items-center">
                            <Button variant="ghost" size="icon" onClick={handlePrevStep} disabled={currentStep === 0} aria-label="Previous step">
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <span className="text-sm font-medium text-muted-foreground">Part {currentPart} of {totalParts}</span>
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

                            <div className="relative h-[350px] overflow-y-auto flex flex-col items-center pr-2">
                                <AnimatePresence mode="wait">
                                    {currentWizardStepConfig &&
                                    <motion.div
                                        key={currentStep}
                                        variants={stepVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        className="w-full flex flex-col items-center text-center"
                                    >
                                        <div className="flex flex-col items-center text-center gap-3 mb-5">
                                            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-card-foreground">
                                                {currentWizardStepConfig.title}
                                                </p>
                                                <p className="text-base text-muted-foreground max-w-md mx-auto">
                                                    {isTyping ? 
                                                        <span className="animate-pulse">...</span> : 
                                                        currentWizardStepConfig.aiMessage
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {!isTyping && (
                                            <div className="space-y-3 w-full max-w-md">
                                                <div className={cn(
                                                "grid grid-cols-1 gap-3",
                                                currentWizardStepConfig.options.length > 2 && "sm:grid-cols-2",
                                                currentWizardStepConfig.step === 6 && "max-h-[260px] overflow-y-auto pr-2"
                                                )}>
                                                    {currentWizardStepConfig.options.map(option => {
                                                        const Icon = (option as any).icon;
                                                        const isSelected = currentWizardStepConfig.isMultiSelect 
                                                            ? (selections[currentWizardStepConfig.key] || []).includes(option.label)
                                                            : selections[currentWizardStepConfig.key] === option.label;

                                                        return (
                                                            <motion.button
                                                                key={option.label}
                                                                variants={pillVariants}
                                                                whileHover="hover"
                                                                whileTap="tap"
                                                                onClick={() => handleSelect(currentWizardStepConfig.key, option.label)}
                                                                className={cn(
                                                                    "p-3 text-center rounded-lg border text-base font-medium transition-all duration-200",
                                                                    isSelected
                                                                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                                        : "bg-background/50 hover:border-primary hover:bg-primary/5",
                                                                    (option as any).description && "items-start",
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
                                                    {currentWizardStepConfig.additionalOptions?.map(option => (
                                                        <motion.button
                                                            key={option}
                                                            variants={pillVariants}
                                                            whileHover="hover"
                                                            whileTap="tap"
                                                            onClick={() => handleSelect(currentWizardStepConfig.key, option)}
                                                            className={cn(
                                                                "p-3 text-center rounded-lg border text-base font-medium transition-all duration-200 sm:col-span-2",
                                                                selections[currentWizardStepConfig.key] === option
                                                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                                    : "bg-background/50 hover:border-primary hover:bg-primary/5"
                                                            )}
                                                        >
                                                            {option}
                                                        </motion.button>
                                                    ))}
                                                </div>

                                                {currentWizardStepConfig.key === 'billAvailable' && selections.billAvailable === "Yes, I'll upload it" && (
                                                    <motion.div initial={{opacity:0, height: 0}} animate={{opacity:1, height: 'auto'}} className="w-full">
                                                        <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary transition-colors duration-300">
                                                            <UploadCloud className="h-12 w-12 text-muted-foreground/70 mb-4" />
                                                            <p className="font-semibold text-foreground mb-1">Click to upload or drag and drop</p>
                                                            <p className="text-sm text-muted-foreground">PNG, JPG, or PDF (max 5MB)</p>
                                                            <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {currentWizardStepConfig.isInput && (
                                                    <motion.div initial={{opacity:0, height: 0}} animate={{opacity:1, height: 'auto'}} transition={{duration: 0.3}} className="space-y-3">
                                                        <div className="relative">
                                                            {currentWizardStepConfig.icon && <currentWizardStepConfig.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />}
                                                            <Input 
                                                                type={currentWizardStepConfig.inputType || "text"}
                                                                placeholder={currentWizardStepConfig.customPlaceholder || `Enter ${currentWizardStepConfig.title}`}
                                                                className="pl-10 h-12 text-base text-center"
                                                                value={selections[currentWizardStepConfig.key] || ''}
                                                                onChange={(e) => handleCustomValueChange(currentWizardStepConfig.key, e.target.value)}
                                                                onKeyDown={handleCustomSubmit}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                                
                                                {(isStepComplete(currentStep)) && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="space-y-3">
                                                        <Button 
                                                            size="lg" 
                                                            className="w-full h-12 text-base mt-4" 
                                                            onClick={handlePrimaryAction}
                                                        >
                                                            {getButtonText()}
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                    }
                                </AnimatePresence>
                            </div>
                        </>
                    )}

                    {isLoading && (
                         <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
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

                    {comparisonResult && !isLoading && (
                        <div className="mt-4">
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
                                    <p className="text-xs text-muted-foreground/80 mt-2">
                                        Results sourced live from your .NET comparison engine.
                                    </p>
                                </div>

                                <Carousel opts={{ align: "start" }} className="w-full mt-6 max-w-4xl mx-auto">
                                <CarouselContent className="-ml-2">
                                    {Array.isArray(comparisonResult.recommendedPlans) && comparisonResult.recommendedPlans.map((plan, index) => (
                                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/1 pl-2">
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
        </div>

        <Dialog open={isLeadModalOpen} onOpenChange={setIsLeadModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Almost there!</DialogTitle>
                    <DialogDescription>
                        Enter your details below to see your personalized savings and get a copy sent to your email.
                    </DialogDescription>
                </DialogHeader>
                <Form {...leadForm}>
                    <form onSubmit={leadForm.handleSubmit(onLeadSubmit)} className="space-y-4">
                        <FormField
                            control={leadForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="John Doe" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={leadForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="email" placeholder="john.doe@example.com" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={leadForm.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="tel" placeholder="07123 456789" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSavingLead}>
                            {isSavingLead ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                "See My Results"
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

      </div>
    </section>
  );
}

    

    