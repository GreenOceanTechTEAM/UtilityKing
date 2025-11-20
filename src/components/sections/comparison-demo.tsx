
"use client";

import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactMarkdown from 'react-markdown';
import { format } from "date-fns";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ArrowRight, Zap, Loader2, Sparkles, Home, Building, Factory, ChevronLeft, ChevronRight, UploadCloud, CalendarDays, Leaf, Search, User, Mail, Phone, CheckCircle, BarChart3, ShieldCheck, Smile, Flame, Download } from 'lucide-react';
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
        key: 'utilityType',
        title: "Utility Type",
        aiMessage: "Which utility are you looking to compare?",
        options: [
            { label: "Gas", icon: Flame },
            { label: "Electricity", icon: Zap },
        ],
    },
    {
        step: 3,
        part: 1,
        key: 'preferences',
        title: "Your Preferences",
        aiMessage: "What matters most to you in a new plan?",
        options: [
            { label: "Cheapest price" }, { label: "Fixed rate contract" }, { label: "Flexible / no exit fees" },
            { label: "Smart meter compatible" }, { label: "Fastest switching" }, { label: "Best customer service" }
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

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<{ [key: string]: any }>({});
  const [isTyping, setIsTyping] = useState(true);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummarizeComparisonOutput | null>(null);

  const [date, setDate] = React.useState<Date>()

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [pdfTimestamp, setPdfTimestamp] = useState('');

  const activeWizardSteps = React.useMemo(() => {
    return wizardSteps;
  }, []);
  
  const leadForm = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  const currentWizardStepConfig = wizardSteps[currentStep];

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), AI_TYPING_DELAY);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSelect = (stepKey: string, option: string) => {
    if (stepKey === 'utilityType' && option !== 'Gas') {
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
    
    const stepConfig = wizardSteps.find(s => s.key === stepKey);
    if (stepConfig && !stepConfig.isMultiSelect && !stepConfig.isInput && !stepConfig.isDateInput) {
        setTimeout(() => handleNextStep(), 300);
    }
  };
  
  const handleCustomValueChange = (stepKey: string, value: string) => {
    setSelections(prev => ({...prev, [stepKey]: value}));
  }

  const handleDateSelect = (selectedDate?: Date) => {
    setDate(selectedDate)
    if (selectedDate) {
        setSelections(prev => ({
            ...prev,
            contractEndDay: format(selectedDate, "d"),
            contractEndMonth: format(selectedDate, "M"),
            contractEndYear: format(selectedDate, "yyyy"),
        }));
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
    const step = wizardSteps[stepIndex];
    if (!step) return false;
    
    const selection = selections[step.key];

    if (step.isMultiSelect) {
        return selection && selection.length > 0;
    }
    
    if (step.key === 'contractEndDate') {
        return !!selections.contractEndDay && !!selections.contractEndMonth && !!selections.contractEndYear;
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
        day: selections['contractEndDay'] || '1',
        month: selections['contractEndMonth'] || '1',
        year: selections['contractEndYear'] || new Date().getFullYear().toString(),
        email: "",
        mprn: "",
        business: "",
        contactName: "",
        phone: "",
        pdfFileName: ""
    };
    
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
        
        let plansData: RecommendedPlan[];
        let parsedInnerJson;
        // The backend response is a stringified JSON inside the 'd' property.
        const parsedInnerJsonString = resultData.d;

        if (typeof parsedInnerJsonString === 'string') {
          // It's a double-encoded JSON string, parse it again.
          parsedInnerJson = JSON.parse(parsedInnerJsonString);
        } else {
            // It might be already parsed.
            parsedInnerJson = parsedInnerJsonString;
        }

        if (Array.isArray(parsedInnerJson)) {
            plansData = parsedInnerJson;
        } else if (typeof parsedInnerJson === 'object' && parsedInnerJson !== null) {
            // Handle case where a single object is returned
            plansData = [parsedInnerJson];
        } else {
            throw new Error("Parsed inner JSON is not an array or a single object.");
        }
        
        const finalResult: IntelligentUtilityComparisonOutput = {
            comparisonSummary: "Here are your personalized results based on the latest market data.",
            recommendedPlans: plansData.map((plan: RecommendedPlan) => {
                const yearlyCostString = String(plan.yearlycost || '0').replace(/[^0-9.]/g, '');
                const price = parseFloat(yearlyCostString);
                
                const features: string[] = [];
                if (plan.nightrate) features.push(`Night Rate: ${plan.nightrate}`);
                if (plan.offpeakrate) features.push(`Off-Peak Rate: ${plan.offpeakrate}`);
                if (plan.eveningweekendrate) features.push(`Evening/Weekend Rate: ${plan.eveningweekendrate}`);
                if (plan.unitrate) features.push(`Unit Rate: ${plan.unitrate}`);

                const duration = plan.duration?.replace(/[^0-9]/g, '') || '0';
                const durationMonths = parseInt(duration, 10);

                return {
                    provider: plan.supplier || 'Unknown Supplier',
                    planName: `Standing Charge: ${plan.standingcharge || 'N/A'}`,
                    unitRate: `Unit Rate: ${plan.unitrate || 'N/A'}`,
                    price: !isNaN(price) ? price : 0,
                    durationMonths,
                    contractLength: plan.duration ? `Duration: ${plan.duration}` : 'Variable',
                    link: '#', 
                    features: [],
                };
            }),
        };
        
        setComparisonResult(finalResult);

        if (user && firestore) {
          const comparisonData = {
            userId: user.uid,
            userInput: JSON.stringify(selections),
            comparisonResult: JSON.stringify(finalResult),
            timestamp: serverTimestamp(),
          };
          const comparisonsCollection = collection(firestore, `users/${user.uid}/ai_comparisons`);
          await addDoc(comparisonsCollection, comparisonData);
          console.log("Comparison result saved to Firestore.");
        }

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
    if (!firestore || !auth) {
      toast({ variant: "destructive", title: "Connection Error", description: "Could not connect to the database." });
      return;
    }
    
    setIsSavingLead(true);
    
    try {
      let currentUser = user;
      if (!currentUser) {
          const userCredential = await signInAnonymously(auth);
          currentUser = userCredential.user;
      }
      
      const leadData = {
        ...values,
        comparisonInputs: selections,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
      };
      
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

  const handleSummarize = async () => {
    if (!comparisonResult) return;
    setIsSummarizing(true);
    setSummary(null);

    try {
        const aiResult = await summarizeComparison({
            selections: selections,
            results: comparisonResult.recommendedPlans,
        });
        setSummary(aiResult);
    } catch (error: any) {
        console.error("AI summarization failed:", error);
        toast({
            variant: "destructive",
            title: "AI Summary Failed",
            description: `UKi couldn't generate a summary. ${error.message}`,
        });
    } finally {
        setIsSummarizing(false);
    }
  };

  const handleDownloadPdf = async () => {
    const pdfElement = pdfContainerRef.current;
    if (!pdfElement) return;

    setIsLoading(true);
    setPdfTimestamp(new Date().toLocaleString());

    // Needs a slight delay to allow React to render the hidden component with the new timestamp
    setTimeout(async () => {
        try {
            const canvas = await html2canvas(pdfElement, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            });
            
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;
            
            const contentWidth = pdfWidth - 20; // with margin
            const contentHeight = contentWidth / canvasAspectRatio;

            let heightLeft = contentHeight;
            let position = 10; // top margin

            pdf.addImage(imgData, 'PNG', 10, position, contentWidth, contentHeight);
            heightLeft -= (pdfHeight - 20);

            while (heightLeft > 0) {
                position = position - (pdfHeight - 20);
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, contentWidth, contentHeight);
                heightLeft -= (pdfHeight - 20);
            }

            pdf.save('UtilityKing_Quote.pdf');
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            toast({
                variant: "destructive",
                title: "PDF Download Failed",
                description: "Sorry, we couldn't generate the PDF at this time."
            });
        } finally {
            setIsLoading(false);
        }
    }, 100);
};

  const categorizedPlans = useMemo((): CategorizedPlans | null => {
    if (!comparisonResult) return null;
    
    const plans = [...comparisonResult.recommendedPlans];
    if (plans.length === 0) return { cheapest: null, oneYear: [], twoYear: [], threeYear: [], fourPlusYear: [] };

    const sortedByPrice = plans.sort((a, b) => a.price - b.price);
    const cheapest = sortedByPrice[0] ? { ...sortedByPrice[0] } : null;

    return {
        cheapest: cheapest,
        oneYear: plans.filter(p => p.durationMonths === 12),
        twoYear: plans.filter(p => p.durationMonths === 24),
        threeYear: plans.filter(p => p.durationMonths === 36),
        fourPlusYear: plans.filter(p => p.durationMonths > 36),
    };
  }, [comparisonResult]);


  const progress = (currentStep / (wizardSteps.length -1)) * 100;

  const getButtonText = () => {
    if (currentStep < wizardSteps.length - 1) {
      return "Next Step";
    }
    return "Compare Energy Deals";
  }
  
  const analysisLines = [
      "Connecting to live pricing data...",
      "Analyzing available tariffs in your area...",
      "Calculating personalized annual cost estimates...",
      "Checking for exclusive online-only deals...",
      "Finalizing your top recommendations...",
  ];

  const renderPlans = (plans: RenderedPlan[], category: string) => {
    if (!plans || plans.length === 0) {
        return <p className="text-muted-foreground text-center col-span-full py-8">No {category} plans found for your criteria.</p>;
    }

    return plans.map((plan, index) => (
        <motion.div
            key={`${category}-${index}`}
            custom={index}
            initial={{ opacity: 0, y: 20 }}
            animate={(i) => ({
                opacity: 1,
                y: 0,
                transition: { delay: 0.1 + i * 0.08, ease: "easeOut" }
            })}
        >
            <Card className="flex flex-col h-full bg-card border-border hover:border-primary/80 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <Badge variant="secondary" className="mb-2">{plan.provider}</Badge>
                            <CardTitle className="text-lg font-semibold text-foreground">{plan.planName}</CardTitle>
                            {plan.unitRate && (
                              <p className="text-accent font-semibold text-xl mt-2">{plan.unitRate}</p>
                            )}
                        </div>
                        {iconMap[plan.provider] || <Zap className="h-5 w-5 text-amber-500" />}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <div className="font-headline text-3xl md:text-[40px] font-bold text-foreground tracking-tight">
                        £{plan.price.toFixed(2)}
                        <span className="text-base font-normal text-muted-foreground">/year</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {plan.contractLength}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    ));
};

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
                
                {!isLoading && !comparisonResult && (
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
                                                            type={"text"}
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
                                                <Popover>
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

                {comparisonResult && !isLoading && categorizedPlans && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-4"
                    >
                         <div
                            ref={pdfContainerRef}
                            style={{ position: 'absolute', left: '-9999px', width: '800px', backgroundColor: 'white', padding: '20px', color: 'black' }}
                         >
                            <div className="text-center mb-6 border-b pb-4">
                                <h2 className="font-headline text-2xl font-bold text-blue-600">UtilityKing</h2>
                                <p className="text-sm text-gray-500">Your Personalised Energy Quote</p>
                                {pdfTimestamp && <p className="text-xs text-gray-400 mt-1">Generated on: {pdfTimestamp}</p>}
                            </div>
                            
                            {summary && (
                                <div className="my-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <h3 className="font-headline text-xl font-bold text-gray-800 mb-2">AI Summary from UKi</h3>
                                    <ReactMarkdown className="prose prose-sm max-w-full text-base text-gray-800 whitespace-pre-wrap">{summary.summary}</ReactMarkdown>
                                </div>
                            )}
                            
                            <div>
                                {categorizedPlans.cheapest && (
                                    <div className="mb-6">
                                        <h3 className="font-headline text-xl font-bold text-gray-800 mb-2 border-b pb-1">Cheapest Deal</h3>
                                        {renderPdfPlans([categorizedPlans.cheapest])}
                                    </div>
                                )}
                                {categorizedPlans.oneYear.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-headline text-xl font-bold text-gray-800 mb-2 border-b pb-1">1-Year Fixed Deals</h3>
                                        {renderPdfPlans(categorizedPlans.oneYear)}
                                    </div>
                                )}
                                {categorizedPlans.twoYear.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-headline text-xl font-bold text-gray-800 mb-2 border-b pb-1">2-Year Fixed Deals</h3>
                                        {renderPdfPlans(categorizedPlans.twoYear)}
                                    </div>
                                )}
                                {categorizedPlans.threeYear.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-headline text-xl font-bold text-gray-800 mb-2 border-b pb-1">3-Year Fixed Deals</h3>
                                        {renderPdfPlans(categorizedPlans.threeYear)}
                                    </div>
                                )}
                                {categorizedPlans.fourPlusYear.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-headline text-xl font-bold text-gray-800 mb-2 border-b pb-1">4+ Year Fixed Deals</h3>
                                        {renderPdfPlans(categorizedPlans.fourPlusYear)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='text-center mb-6'>
                            <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary">Your Cheapest Energy Deals</h3>
                            <p className='text-muted-foreground max-w-2xl mx-auto'>{comparisonResult.comparisonSummary}</p>
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button onClick={handleSummarize} disabled={isSummarizing} size="icon">
                                                {isSummarizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Summarize with UKi</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button onClick={handleDownloadPdf} variant="outline" disabled={isLoading} size="icon">
                                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Download PDF</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        
                        {isSummarizing && (
                            <div className="text-center my-4 text-muted-foreground">
                                <p>UKi is analyzing your results...</p>
                            </div>
                        )}

                        {summary && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="my-6 p-4 rounded-lg bg-primary/10 border border-primary/20"
                            >
                                <ReactMarkdown className="prose prose-sm max-w-full text-base text-foreground whitespace-pre-wrap">{summary.summary}</ReactMarkdown>
                            </motion.div>
                        )}

                         <Tabs defaultValue="cheapest" className="w-full">
                            <div className="overflow-x-auto sm:overflow-visible pb-2">
                                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                                    <TabsTrigger value="cheapest" disabled={!categorizedPlans.cheapest}>Cheapest</TabsTrigger>
                                    <TabsTrigger value="1year" disabled={categorizedPlans.oneYear.length === 0}>1 Year</TabsTrigger>
                                    <TabsTrigger value="2year" disabled={categorizedPlans.twoYear.length === 0}>2 Year</TabsTrigger>
                                    <TabsTrigger value="3year" disabled={categorizedPlans.threeYear.length === 0}>3 Year</TabsTrigger>
                                    <TabsTrigger value="4plus" disabled={categorizedPlans.fourPlusYear.length === 0}>4+ Years</TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value="cheapest" className="mt-4">
                                 <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    {categorizedPlans.cheapest ? renderPlans([categorizedPlans.cheapest], "cheapest") : <p>No plans found.</p>}
                                 </div>
                            </TabsContent>
                            <TabsContent value="1year" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderPlans(categorizedPlans.oneYear, "1-year")}</div>
                            </TabsContent>
                            <TabsContent value="2year" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderPlans(categorizedPlans.twoYear, "2-year")}</div>
                            </TabsContent>
                            <TabsContent value="3year" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderPlans(categorizedPlans.threeYear, "3-year")}</div>
                            </TabsContent>
                            <TabsContent value="4plus" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderPlans(categorizedPlans.fourPlusYear, "4+ year")}</div>
                            </TabsContent>
                        </Tabs>
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
