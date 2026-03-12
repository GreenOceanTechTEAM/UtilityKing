
"use client";

import * as React from 'react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ArrowRight, Zap, Loader2, Sparkles, Home, Building, Factory, ChevronLeft, CalendarDays, Leaf, Search, User, Mail, Phone, CheckCircle, Briefcase, Hash, Info, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { useFirebase } from '@/firebase';
import { ComparisonResetContext } from '@/app/page';

// Define the shape of the data used for rendering in the component
interface RenderedPlan {
    planName: string;
    provider: string;
    price: number;
    durationMonths: number;
    contractLength: string;
    link: string;
    features: string[];
    unitRate: string | undefined;
}
interface IntelligentUtilityComparisonOutput {
    comparisonSummary: string;
    recommendedPlans: RenderedPlan[];
}

type ComparisonDemoProps = {
  id: string;
  setResetFunction: (resetFn: () => void) => void;
};

const leadSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().min(10, "Please enter a valid phone number."),
});

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
        key: 'businessName',
        title: "Business Name",
        aiMessage: "What is the name of your business?",
        isInput: true,
        customPlaceholder: "e.g., ACME Inc.",
        icon: Briefcase,
        options: [],
        condition: (selections: any) => selections.premisesType && selections.premisesType !== 'Home'
    },
    {
        step: 3,
        part: 1,
        key: 'utilityType',
        title: "Utility Type",
        aiMessage: "Which utility are you looking to compare?",
        options: [
            { label: "Gas", icon: Zap },
            { label: "Electricity", icon: Zap },
        ],
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
        key: 'mpr',
        title: "MPR Number (Gas) (Optional)",
        aiMessage: "What's your Meter Point Reference (MPR)? You can find it on your gas bill or skip this step.",
        isInput: true,
        customPlaceholder: "e.g., 1234567890",
        options: [],
        icon: Hash,
        condition: (selections: any) => selections.utilityType === 'Gas'
    },
     {
        step: 7,
        part: 2,
        key: 'mpan',
        title: "Supply Number (Electricity)",
        aiMessage: "What's your 21-digit Supply Number (MPAN)? You can find it on your electricity bill.",
        isInput: true,
        customPlaceholder: "e.g., 12 345 678 9101 2345 6789",
        options: [],
        icon: Hash,
        condition: (selections: any) => selections.utilityType === 'Electricity'
    },
    {
        step: 8,
        part: 2,
        key: 'supplier',
        title: "Current Supplier",
        aiMessage: "Who is your current supplier?",
        options: [
          { label: "British Gas" },
          { label: "British Gas Renewables" },
          { label: "British Gas Lite" },
          { label: "DELTA GAS AND POWER" },
          { label: "British Gas Plus" },
          { label: "Smartest Energy" },
          { label: "Smartest Renewables Energy" },
          { label: "Smartest Smartpay Energy" },
          { label: "DYCEENERGY" },
          { label: "EDFONLINE" },
          { label: "EDFSTANDARD" },
          { label: "Scottish & Southern Electric" },
          { label: "Scottish Power" },
          { label: "NPower" },
          { label: "VALDA ENERGY" },
          { label: "EON ENERGY" },
          { label: "EONNEXT" },
          { label: "CNG" },
          { label: "OPUS" },
          { label: "PozitiveEnergy" },
          { label: "Crown" },
          { label: "Total Gas & Power" },
          { label: "GAZPROM" },
          { label: "SEFE" },
          { label: "UTILITA" },
          { label: "GULF" },
          { label: "YU Energy" },
          { label: "DRAX" },
          { label: "OCTOPUS Energy" },
          { label: "DENERGY" },
          { label: "AXIS ENERGY" },
          { label: "BES UTILITIES" },
          { label: "ECOTRICITY" },
          { label: "OVO Energy" },
          { label: "HUDSON ENERGY" },
          { label: "UTILITO" },
          { label: "UTILITY WAREHOUSE" },
          { label: "XLN ENERGY" },
          { label: "YORKSHIRE GAS AND POWER" },
          { label: "YORKSHIRE RENEWABLE GAS AND POWER" },
          { label: "GREEN ENERGY GAS AND POWER" },
          { label: "GOOD ENERGY" },
          { label: "BULB ENERGY" },
          { label: "JELLYFISH ENERGY" },
          { label: "CORONA ENERGY" },
          { label: "KENNEX ENERGY" },
          { label: "UNITED GAS" },
          { label: "UNICOM" },
        ],
        additionalOptions: ["Other", "I Don’t Know"]
    },
    {
        step: 9,
        part: 2,
        key: 'usage',
        title: "Energy Usage",
        aiMessage: "What's your yearly consumption in kWh?",
        isInput: true,
        customPlaceholder: "e.g., 2700",
        options: [],
    },
    {
        step: 10,
        part: 2,
        key: 'contractEndDate',
        title: "Contract End Date (Optional)",
        aiMessage: "When does your current contract end?",
        isInput: false,
        isDateInput: true,
        icon: CalendarDays,
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

export default function ComparisonDemo({ id, setResetFunction }: ComparisonDemoProps) {
  const [view, setView] = useState<'start' | 'form'>('start');
  const [isLoading, setIsLoading] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSavingLead, setIsSavingLead] = useState(false);
  const { toast } = useToast();
  const { firestore, auth } = useFirebase();
  const [showThankYou, setShowThankYou] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<{ [key: string]: any }>({});
  const [isTyping, setIsTyping] = useState(true);

  const [leadDetails, setLeadDetails] = useState<z.infer<typeof leadSchema> | null>(null);

  const [date, setDate] = React.useState<Date>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  
  const leadForm = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  const handleReset = useCallback(() => {
    setIsLoading(false);
    setIsLeadModalOpen(false);
    setIsSavingLead(false);
    setCurrentStep(0);
    setSelections({});
    setLeadDetails(null);
    setDate(undefined);
    setShowThankYou(false);
    setSubmissionStatus('idle');
    setView('start');
    leadForm.reset({ name: '', email: '', phone: '' });
  }, [leadForm]);

  useEffect(() => {
    setResetFunction(handleReset);
  }, [handleReset, setResetFunction]);


  const activeWizardSteps = React.useMemo(() => {
    return wizardSteps.filter(step => !step.condition || step.condition(selections));
  }, [selections]);
  
  const currentWizardStepConfig = activeWizardSteps[currentStep];

  useEffect(() => {
    if (view === 'form') {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), AI_TYPING_DELAY);
        return () => clearTimeout(timer);
    }
  }, [currentStep, view]);


  const handleNextStep = () => {
    if (currentStep < activeWizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
        handlePrimaryAction();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelect = (stepKey: string, option: string) => {
    setSelections({ ...selections, [stepKey]: option });
    if (!currentWizardStepConfig.isInput && !currentWizardStepConfig.isDateInput) {
        setTimeout(() => handleNextStep(), 300);
    }
  };
  
  const handleCustomValueChange = (stepKey: string, value: string) => {
    setSelections(prev => ({...prev, [stepKey]: value}));
  }

  const handleDateSelect = (selectedDate?: Date, skip: boolean = false) => {
    if (skip) {
        setDate(undefined);
        setSelections(prev => ({...prev, contractEndDate: ''}));
        setIsCalendarOpen(false);
        setTimeout(() => handleNextStep(), 300);
        return;
    }

    setDate(selectedDate);
    if (selectedDate) {
        setSelections(prev => ({
            ...prev,
            contractEndDate: format(selectedDate, "yyyy-MM-dd"),
        }));
        setIsCalendarOpen(false);
        setTimeout(() => handleNextStep(), 300);
    }
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
    const step = activeWizardSteps[stepIndex];
    if (!step) return false;
    
    if (step.key === 'mpr' && selections.utilityType === 'Gas') return true; 
    if (step.key === 'contractEndDate') return true;
    
    const selection = selections[step.key];
    
    if (step.key === 'businessName' && selections.premisesType !== 'Home') return !!selection;
    if (step.key === 'mpan' && selections.utilityType === 'Electricity') return !!selection;

    return !!selection;
  }

  const handleFormSubmit = async (leadData: z.infer<typeof leadSchema>) => {
    setIsSavingLead(true);
    
    // The backend expects specific field names. Let's map our data to that structure.
    const [year, month, day] = selections.contractEndDate 
        ? selections.contractEndDate.split('-') 
        : ['', '', ''];

    const submissionData = {
        sContactName: leadData.name || '',
        xEmail: leadData.email || '',
        sPhone: leadData.phone || '',
        xPostCode: selections.postcode || '',
        // The backend seems to use xMPRN for both gas and electricity meter numbers
        xMPRN: (selections.utilityType === 'Gas' ? selections.mpr : selections.mpan) || '',
        xGasStartDay: day,
        xGasStartMonth: month,
        xGasStartYear: year,
        xCurGasSupply: selections.supplier || '',
        xEacGas: selections.usage || '',
        // The backend expects a string 'true' or 'false'
        xBusiness: selections.premisesType !== 'Home' ? 'true' : 'false',
        // This parameter was missing from our form, sending an empty string.
        sPdfFileName: '', 
    };

    try {
        // This now calls the Next.js API route which will proxy to the .NET backend
        const response = await fetch('/api/webhook-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
            // Try to parse the error response from the backend
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        // The submission was successful
        setLeadDetails(leadData);
        setIsLeadModalOpen(false);
        setShowThankYou(true);
        toast({
            title: "Quotation Request Confirmed",
            description: "Your details have been sent successfully. We'll be in touch shortly!",
        });

    } catch (error: any) {
        console.error("Failed to submit lead:", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: error.message || "There was a problem submitting your details. Please try again.",
        });
    } finally {
        setIsSavingLead(false);
    }
  };


  const handlePrimaryAction = () => {
    if (currentStep === activeWizardSteps.length - 1 && isStepComplete(currentStep)) {
      setIsLeadModalOpen(true);
    } else if (isStepComplete(currentStep)) {
      handleNextStep();
    }
  };

  const progress = (currentStep / (activeWizardSteps.length -1)) * 100;

  const getButtonText = () => {
    if (currentStep < activeWizardSteps.length - 1) return "Continue";
    return "Get My Quote";
  }
  
  const analysisLines = [
      "Connecting to live pricing data...",
      "Analyzing available tariffs in your area...",
      "Calculating personalized annual cost estimates...",
      "Checking for exclusive online-only deals...",
      "Finalizing your top recommendations...",
  ];

  return (
    <section id={id} className="py-16 sm:py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="w-full max-w-4xl mx-auto">
            <div className="relative rounded-2xl p-4 sm:p-6 bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/25 shadow-lg min-h-[550px] flex items-center justify-center">
                
                <AnimatePresence mode="wait">
                  {view === 'start' ? (
                    <motion.div
                      key="start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="text-center flex flex-col items-center justify-center w-full max-w-3xl"
                    >
                      <h2 className="font-headline text-4xl tracking-tight md:text-5xl font-bold text-foreground">
                        Let’s Find Your Best Energy Deal — Instantly
                      </h2>
                      <p className="mx-auto mt-6 text-xl text-muted-foreground">
                       Answer a few quick questions and our AI will calculate the smartest, cheapest tariff available for your home.
                      </p>
                      
                        <div className="relative h-8 mb-12 text-center flex items-center justify-center">
                            <p className="text-xl text-muted-foreground font-medium flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-accent" />
                                Analyze hundreds of tariffs in real-time & switch in minutes.
                            </p>
                        </div>
                      
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <Button
                          size="lg"
                          className="text-lg font-semibold h-16 px-12"
                          onClick={() => setView('form')}
                        >
                          <Zap className="mr-3 h-6 w-6" />
                          Start Comparison
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="w-full"
                    >
                      {!showThankYou && !isLoading && (
                          <>
                              <div className="w-full bg-primary/10 rounded-full h-1 mb-6">
                                  <motion.div 
                                      className="bg-primary h-1 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${progress}%`}}
                                      transition={{ duration: 0.5, ease: "easeInOut" }}
                                  />
                              </div>

                              <div className="relative min-h-[380px] overflow-y-auto flex flex-col items-center pr-2">
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
                                                  <p className="text-xl font-semibold text-card-foreground">
                                                  {currentWizardStepConfig.title}
                                                  </p>
                                                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                                      {isTyping ? 
                                                          <span className="animate-pulse">...</span> : 
                                                          currentWizardStepConfig.aiMessage
                                                      }
                                                  </p>
                                              </div>
                                          </div>
                                          
                                          {!isTyping && (
                                              <div className="space-y-3 w-full max-w-lg">
                                                  {(currentWizardStepConfig.key === 'mpr' || currentWizardStepConfig.key === 'mpan') && (
                                                      <motion.div
                                                          initial={{ opacity: 0, y: -10 }}
                                                          animate={{ opacity: 1, y: 0 }}
                                                          className="flex items-center justify-center gap-2 text-base text-accent bg-accent/10 p-2 rounded-md mb-4"
                                                      >
                                                          <Info className="h-5 w-5" />
                                                          <span>You can find this on your latest bill.</span>
                                                      </motion.div>
                                                  )}

                                                  <div className={cn(
                                                    "grid grid-cols-1 gap-3",
                                                    currentWizardStepConfig.options.length > 2 && "sm:grid-cols-2",
                                                    currentWizardStepConfig.key === 'supplier' && "max-h-[260px] overflow-y-auto pr-2"
                                                  )}>
                                                      {currentWizardStepConfig.options.map(option => {
                                                          const Icon = (option as any).icon;
                                                          return (
                                                              <motion.button
                                                                  key={option.label}
                                                                  variants={pillVariants}
                                                                  whileHover="hover"
                                                                  whileTap="tap"
                                                                  onClick={() => handleSelect(currentWizardStepConfig.key, option.label)}
                                                                  className={cn(
                                                                      "p-4 text-center rounded-lg border text-lg font-medium transition-all duration-200",
                                                                      selections[currentWizardStepConfig.key] === option.label
                                                                          ? "bg-primary text-primary-foreground border-primary shadow-md pulse-border"
                                                                          : "bg-background/50 hover:border-primary hover:bg-primary/5",
                                                                  )}
                                                              >
                                                                  <div className="flex items-center justify-center gap-3">
                                                                      {Icon && <Icon className="h-6 w-6" />}
                                                                      <span className="font-semibold">{option.label}</span>
                                                                  </div>
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
                                                                  "p-4 text-center rounded-lg border text-lg font-medium transition-all duration-200 sm:col-span-2",
                                                                  selections[currentWizardStepConfig.key] === option
                                                                      ? "bg-primary text-primary-foreground border-primary shadow-md pulse-border"
                                                                      : "bg-background/50 hover:border-primary hover:bg-primary/5"
                                                              )}
                                                          >
                                                              {option}
                                                          </motion.button>
                                                      ))}
                                                  </div>

                                                  {currentWizardStepConfig.isInput && (
                                                      <motion.div initial={{opacity:0, height: 0}} animate={{opacity:1, height: 'auto'}} transition={{duration: 0.3}} className="space-y-3">
                                                          <div className="relative">
                                                              {currentWizardStepConfig.icon && <currentWizardStepConfig.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />}
                                                              <Input 
                                                                  type={currentWizardStepConfig.key === 'usage' ? 'number' : 'text'}
                                                                  placeholder={currentWizardStepConfig.customPlaceholder || `Enter ${currentWizardStepConfig.title}`}
                                                                  className="pl-10 h-12 text-lg text-center"
                                                                  value={selections[currentWizardStepConfig.key] || ''}
                                                                  onChange={(e) => handleCustomValueChange(currentWizardStepConfig.key, e.target.value)}
                                                                  onKeyDown={handleCustomSubmit}
                                                              />
                                                          </div>
                                                      </motion.div>
                                                  )}

                                                  {currentWizardStepConfig.isDateInput && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-3">
                                                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                        <PopoverTrigger asChild>
                                                          <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                              "w-full justify-start text-left font-normal h-12 text-lg",
                                                              !date && "text-muted-foreground"
                                                            )}
                                                          >
                                                            <CalendarDays className="mr-2 h-4 w-4" />
                                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                          </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                          <Calendar
                                                            mode="single"
                                                            selected={date}
                                                            onSelect={(d) => handleDateSelect(d)}
                                                            initialFocus
                                                          />
                                                        </PopoverContent>
                                                      </Popover>
                                                      <Button variant="ghost" className="w-full text-lg h-12" onClick={() => handleDateSelect(undefined, true)}>
                                                          I don't know my contract end date
                                                      </Button>
                                                    </motion.div>
                                                  )}
                                              </div>
                                          )}
                                      </motion.div>
                                      }
                                  </AnimatePresence>
                              </div>
                              <div className="flex justify-center items-center gap-4 pt-4 mt-4 border-t">
                                  <Button type="button" variant="outline" size="lg" onClick={handlePrevStep} disabled={currentStep === 0} className="text-lg h-12">
                                    <ChevronLeft className="mr-2 h-5 w-5" />
                                    Back
                                  </Button>
                                  <Button 
                                      type="button"
                                      size="lg" 
                                      onClick={handlePrimaryAction}
                                      disabled={!isStepComplete(currentStep)}
                                      className="text-lg h-12"
                                  >
                                      {getButtonText()}
                                      <ArrowRight className="ml-2 h-5 w-5" />
                                  </Button>
                              </div>
                          </>
                      )}

                      {isLoading && (
                          <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                              <div className="relative h-32 w-full max-w-sm overflow-hidden text-left font-code">
                                  <AnimatePresence>
                                      {analysisLines.map((line, index) => (
                                      <motion.p
                                          key={line}
                                          custom={index}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={(i) => ({
                                              opacity: [0, 1, 1, 0],
                                              y: [20, 0, 0, -20],
                                              transition: {
                                                  delay: i * 2,
                                                  duration: 2,
                                                  times: [0, 0.1, 0.9, 1]
                                              }
                                          })}
                                          exit={{ opacity: 0 }}
                                          className="absolute inset-0 text-lg text-muted-foreground flex items-center gap-2"
                                      >
                                          <Loader2 className="h-5 w-5 animate-spin text-accent" />
                                          {line}
                                      </motion.p>
                                      ))}
                                  </AnimatePresence>
                              </div>
                            </div>
                      )}

                      {showThankYou && !isLoading && (
                          <motion.div
                              key="thank-you"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
                          >
                              <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', delay: 0.2 }}
                                  className="w-20 h-20 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mb-6"
                              >
                                  <CheckCircle className="w-12 h-12" />
                              </motion.div>
                              <h3 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">
                                Thank You, {leadDetails?.name}!
                              </h3>
                              <p className="max-w-xl text-xl text-muted-foreground">
                                Your tailored quotation with rates is on the way. You will receive an email shortly.
                              </p>
                              <Button onClick={handleReset} className="mt-8 text-lg h-12">
                                  <RefreshCw className="mr-2 h-5 w-5" />
                                  Start New Comparison
                              </Button>
                          </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
        </div>

        <Dialog open={isLeadModalOpen} onOpenChange={setIsLeadModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl">Almost there!</DialogTitle>
                    <DialogDescription className="text-lg">
                        Enter your details below to see your personalized savings and get a copy sent to your email.
                    </DialogDescription>
                </DialogHeader>
                <Form {...leadForm}>
                    <form onSubmit={leadForm.handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FormField
                            control={leadForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Full Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input placeholder="John Doe" {...field} className="pl-10 h-12 text-lg" />
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
                                    <FormLabel className="text-base">Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input type="email" placeholder="john.doe@example.com" {...field} className="pl-10 h-12 text-lg" />
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
                                    <FormLabel className="text-base">Phone Number</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input type="tel" placeholder="07123 456789" {...field} className="pl-10 h-12 text-lg" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full h-12 text-lg" disabled={isSavingLead}>
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

    