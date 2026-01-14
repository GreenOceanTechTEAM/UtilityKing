
"use client";

import * as React from 'react';
import { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactMarkdown from 'react-markdown';
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ArrowRight, Zap, Loader2, Sparkles, Home, Building, Factory, ChevronLeft, ChevronRight, UploadCloud, CalendarDays, Leaf, Search, User, Mail, Phone, CheckCircle, BarChart3, ShieldCheck, Smile, Flame, Download, RefreshCw, Briefcase, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { summarizeComparison, type SummarizeComparisonInput, type SummarizeComparisonOutput } from '@/ai/flows/summarize-comparison-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { ComparisonResetContext } from '@/app/page';


// Define the shape of a single plan coming from the backend
interface RecommendedPlan {
    supplier: string;
    standingcharge: string;
    unitrate: string;
    yearlycost: string;
    duration?: string;
    nightrate?: string;
    offpeakrate?: string;
    eveningweekendrate?: string;
}

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

type CategorizedPlans = {
    cheapest: RenderedPlan | null;
    oneYear: RenderedPlan[];
    twoYear: RenderedPlan[];
    threeYear: RenderedPlan[];
    fourPlusYear: RenderedPlan[];
}


type ComparisonDemoProps = {
  id: string;
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
            { label: "Gas", icon: Flame },
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
        title: "MPR Number (Optional)",
        aiMessage: "What's your Meter Point Reference (MPR)? You can find it on your gas bill or skip this step.",
        isInput: true,
        customPlaceholder: "e.g., 1234567890",
        options: [],
        icon: Hash,
    },
    {
        step: 7,
        part: 2,
        key: 'electricitySupplier',
        title: "Current Supplier",
        aiMessage: "Who is your current electricity supplier?",
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
          { label: "HUDSON ENERGY" },
          { label: "UTILITO" },
          { label: "OVO Energy" },
          { label: "UTILITY WAREHOUSE" },
          { label: "XLN ENERGY" },
          { label: "YORKSHIRE GAS AND POWER" },
          { label: "YORKSHIRE RENEWABLE GAS AND POWER" },
          { label: "GREEN ENERGY GAS AND POWER" },
          { label: "GOOD ENERGY" },
          { label: "BULB ENERGY" },
          { label: "CORONA ENERGY" },
          { label: "KENNEX ENERGY" },
          { label: "UNITED GAS" },
          { label: "UNICOM" },
        ],
        additionalOptions: ["I Don’t Know"]
    },
    {
        step: 8,
        part: 2,
        key: 'usage',
        title: "Energy Usage",
        aiMessage: "What's your yearly consumption in kWh?",
        isInput: true,
        customPlaceholder: "e.g., 2700",
        options: [],
    },
    {
        step: 9,
        part: 2,
        key: 'contractEndDate',
        title: "Contract End Date",
        aiMessage: "When does your current contract end?",
        isInput: false, // This will be handled by custom UI
        isDateInput: true,
        icon: CalendarDays,
        options: [],
    },
];

const dynamicHooks = [
    "Analyze hundreds of tariffs in real-time.",
    "100% impartial and secure results.",
    "Switch suppliers in minutes, hassle-free."
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

const DynamicHook = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % dynamicHooks.length);
        }, 3000); // Change text every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-8 mb-12 text-center flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        {dynamicHooks[index]}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const renderPdfPlans = (plans: RenderedPlan[]) => {
    if (!plans || plans.length === 0) {
        return null;
    }

    return plans.map((plan, index) => (
        <div key={`pdf-${plan.provider}-${index}`} className="p-4 border border-gray-200 rounded-lg bg-white mb-4">
            <div className="flex items-start justify-between">
                <div>
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-800 rounded-full mb-2 inline-block">{plan.provider}</span>
                    <h4 className="text-lg font-semibold text-gray-900">{plan.planName}</h4>
                    {plan.unitRate && (
                        <p className="text-blue-600 font-semibold text-xl mt-2">{plan.unitRate}</p>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">
                    £{plan.price.toFixed(2)}
                    <span className="text-base font-normal text-gray-600">/year</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{plan.contractLength}</p>
                {plan.features && plan.features.length > 0 && (
                    <div className="space-y-1 pt-2 mt-2 border-t">
                        {plan.features.map(feature => (
                            <p key={feature} className="text-xs text-gray-600">{feature}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    ));
};


export default function ComparisonDemo({ id }: ComparisonDemoProps) {
  const [comparisonResult, setComparisonResult] = useState<IntelligentUtilityComparisonOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [isSavingLead, setIsSavingLead] = useState(false);
  const { toast } = useToast();
  const { firestore, auth, user } = useFirebase();
  const isMobile = useIsMobile();
  const resetComparison = useContext(ComparisonResetContext);
  const [showThankYou, setShowThankYou] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<{ [key: string]: any }>({});
  const [isTyping, setIsTyping] = useState(true);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummarizeComparisonOutput | null>(null);
  const [leadDetails, setLeadDetails] = useState<z.infer<typeof leadSchema> | null>(null);

  const [date, setDate] = React.useState<Date>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [pdfTimestamp, setPdfTimestamp] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  

  const activeWizardSteps = React.useMemo(() => {
    return wizardSteps.filter(step => !step.condition || step.condition(selections));
  }, [selections]);
  
  const leadForm = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  const currentWizardStepConfig = activeWizardSteps[currentStep];

  const handleReset = () => {
    setComparisonResult(null);
    setIsLoading(false);
    setIsLeadModalOpen(false);
    setIsSavingLead(false);
    setCurrentStep(0);
    setSelections({});
    setSummary(null);
    setLeadDetails(null);
    setDate(undefined);
    setShowThankYou(false);
    setSubmissionStatus('idle');
    
    leadForm.reset({ name: '', email: '', phone: '' });
    if(resetComparison) resetComparison();
  };

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), AI_TYPING_DELAY);
    return () => clearTimeout(timer);
  }, [currentStep]);


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
    if (stepKey === 'utilityType' && option === 'Electricity') {
        setIsComingSoonModalOpen(true);
        return;
    }

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
    
    const stepConfig = activeWizardSteps.find(s => s.key === stepKey);
    if (stepConfig && !stepConfig.isMultiSelect && !stepConfig.isInput && !stepConfig.isDateInput) {
        setTimeout(() => handleNextStep(), 300);
    }
  };
  
  const handleCustomValueChange = (stepKey: string, value: string) => {
    setSelections(prev => ({...prev, [stepKey]: value}));
  }

  const handleDateSelect = (selectedDate?: Date) => {
    setDate(selectedDate);
    if (selectedDate) {
        setSelections(prev => ({
            ...prev,
            contractEndDate: format(selectedDate, "yyyy-MM-dd"),
        }));
        setIsCalendarOpen(false); // Close popover on select
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
  
    // Make MPR step optional
    if (step.key === 'mpr') {
      return true;
    }
    
    const selection = selections[step.key];

    if (step.isMultiSelect) {
        return selection && selection.length > 0;
    }
    
    if (step.key === 'contractEndDate') {
        return !!selections.contractEndDate;
    }
    
    return !!selection;
  }

  const handleFormSubmit = (leadData: z.infer<typeof leadSchema>) => {
    setLeadDetails(leadData);
    setIsLeadModalOpen(false);
    setShowThankYou(true);
    
    let contractDate: Date | null = null;
    let day = '', month = '', year = '';

    if (selections['contractEndDate']) {
        contractDate = new Date(selections['contractEndDate']);
        day = String(contractDate.getDate());
        month = String(contractDate.getMonth() + 1);
        year = String(contractDate.getFullYear());
    }

    const usageValue = selections['usage'] || '';
    const numericUsage = usageValue.match(/\d+/g)?.join('') || '';

    const formData = {
        postcode: selections['postcode'] || '',
        mpr: selections['mpr'] || '',
        supplier: selections['electricitySupplier'] || '',
        usage: numericUsage,
        day: day,
        month: month,
        year: year,
        premisesType: selections['premisesType'] || 'Home',
        business: selections['businessName'] || (selections['premisesType'] === 'Home' ? 'Personal' : 'Business'),
        renewablePreference: selections['renewablePreference'] || 'No',
        utilityType: selections['utilityType'] || 'Gas',
        email: leadData.email,
        contactName: leadData.name,
        phone: leadData.phone,
    };

    fetch('/api/webhook-proxy-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestData: formData }),
    })
    .then(async (response) => {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend error: ${errorText}`);
        }
        return response.json();
    })
    .then((dbResult) => {
        if (dbResult.d === "1") {
            setSubmissionStatus('success');
             toast({
                title: "Quotation Request Confirmed",
                description: "Your details have been sent successfully.",
            });
        } else {
             setSubmissionStatus('fail');
             console.error("Failed to save lead to .NET backend. Response:", dbResult.d);
             toast({
                variant: "destructive",
                title: "Submission Failed",
                description: `The server responded with an issue: ${dbResult.d}`,
            });
        }
    })
    .catch((error) => {
        setSubmissionStatus('fail');
        console.error("Error submitting form in background:", error);
        toast({
            variant: "destructive",
            title: "Network Error",
            description: "Could not connect to the server. Please try again later.",
        });
    });
};


  const handlePrimaryAction = () => {
    if (currentStep === activeWizardSteps.length - 1 && isStepComplete(currentStep)) {
      setIsLeadModalOpen(true);
    } else if (isStepComplete(currentStep)) {
      handleNextStep();
    }
  };

  async function onLeadSubmit(values: z.infer<typeof leadSchema>) {
    handleFormSubmit(values);
  }

  const progress = (currentStep / (activeWizardSteps.length -1)) * 100;

  const getButtonText = () => {
    if (currentStep < activeWizardSteps.length - 1) {
      return "Continue";
    }
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
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-6 max-w-3xl mx-auto"
        >
            <h2 className="font-headline text-3xl tracking-tight md:text-[38px] font-bold text-foreground">
              Let’s Find Your Best Energy Deal — Instantly
            </h2>
            <p className="mx-auto mt-4 text-lg text-muted-foreground">
             Answer a few quick questions and our AI will calculate the smartest, cheapest tariff available for your home.
            </p>
        </motion.div>
        
        <DynamicHook />

        <div className="w-full max-w-4xl mx-auto">
            <div className="relative rounded-2xl p-4 sm:p-6 bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/25 shadow-lg min-h-[550px]">
                                
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
                                        <div className="space-y-3 w-full max-w-lg">
                                            <div className={cn(
                                            "grid grid-cols-1 gap-3",
                                            currentWizardStepConfig.options.length > 2 && "sm:grid-cols-2",
                                            currentWizardStepConfig.key === 'electricitySupplier' && "max-h-[260px] overflow-y-auto pr-2"
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
                                                                "p-4 text-center rounded-lg border text-lg font-medium transition-all duration-200",
                                                                isSelected
                                                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                                    : "bg-background/50 hover:border-primary hover:bg-primary/5",
                                                                (option as any).description && "items-start",
                                                            )}
                                                        >
                                                            <div className="flex items-center justify-center gap-3">
                                                                {Icon && <Icon className="h-6 w-6" />}
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
                                                            "p-4 text-center rounded-lg border text-lg font-medium transition-all duration-200 sm:col-span-2",
                                                            selections[currentWizardStepConfig.key] === option
                                                                ? "bg-primary text-primary-foreground border-primary shadow-md"
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
                                                            className="pl-10 h-12 text-base text-center"
                                                            value={selections[currentWizardStepConfig.key] || ''}
                                                            onChange={(e) => handleCustomValueChange(currentWizardStepConfig.key, e.target.value)}
                                                            onKeyDown={handleCustomSubmit}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}

                                            {currentWizardStepConfig.isDateInput && (
                                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                                  <PopoverTrigger asChild>
                                                    <Button
                                                      variant={"outline"}
                                                      className={cn(
                                                        "w-full justify-start text-left font-normal h-12 text-base",
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
                                                      onSelect={handleDateSelect}
                                                      initialFocus
                                                    />
                                                  </PopoverContent>
                                                </Popover>
                                              </motion.div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                                }
                            </AnimatePresence>
                        </div>
                         <div className="flex justify-center items-center gap-4 pt-4 mt-4 border-t">
                            <Button type="button" variant="outline" size="lg" onClick={handlePrevStep} disabled={currentStep === 0}>
                              <ChevronLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                            <Button 
                                type="button"
                                size="lg" 
                                onClick={handlePrimaryAction}
                                disabled={!isStepComplete(currentStep)}
                            >
                                {getButtonText()}
                                <ArrowRight className="ml-2 h-4 w-4" />
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
                                    className="absolute inset-0 text-sm text-muted-foreground flex items-center gap-2"
                                >
                                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
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
                            className="w-20 h-20 rounded-full flex items-center justify-center bg-green-100 text-green-600 mb-6"
                        >
                            <CheckCircle className="w-12 h-12" />
                        </motion.div>
                        <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-4">
                           Thank You, {leadDetails?.name}!
                        </h3>
                        <p className="max-w-xl text-lg text-muted-foreground">
                          Your tailored quotation with rates is on the way. You will receive an email shortly.
                        </p>
                        <Button onClick={handleReset} className="mt-8">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Start New Comparison
                        </Button>
                    </motion.div>
                )}
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

        <Dialog open={isComingSoonModalOpen} onOpenChange={setIsComingSoonModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Great Things Are Coming!</DialogTitle>
                    <DialogDescription>
                        Our electricity comparison tool is currently under development. Stay tuned for updates! In the meantime, feel free to compare gas prices.
                    </DialogDescription>
                </DialogHeader>
                <Button onClick={() => setIsComingSoonModalOpen(false)}>
                    Got it!
                </Button>
            </DialogContent>
        </Dialog>

      </div>
    </section>
  );
}

    
    

    