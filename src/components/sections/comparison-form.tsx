"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Edit, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonFormProps {
  onSubmit: (values: { usage: string; preference: string; supplier: string; location: string; }) => void;
}

const steps = [
  { 
    name: "usage", 
    label: "Your Usage:", 
    options: ["Small Home", "Medium Home", "Large Home"],
    customPlaceholder: "e.g. 5-bed house"
  },
  { 
    name: "preference", 
    label: "Your Preference:", 
    options: ["Cheapest", "Renewable", "Fixed Plan"],
    customPlaceholder: "e.g. 18-month contract"
  },
  {
    name: "supplier",
    label: "Current Supplier:",
    options: ["British Gas", "EDF", "SSE"],
    customPlaceholder: "e.g. Octopus"
  },
  { 
    name: "location", 
    label: "Your Location:", 
    options: [],
    customPlaceholder: "e.g. SW1A 0AA"
  },
];

const rowVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.35, ease: "easeIn" } }
};

const CustomInput = ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  }) => (
    <motion.div 
        initial={{ width: 0, opacity: 0 }} 
        animate={{ width: "100%", opacity: 1 }} 
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full"
    >
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
      />
    </motion.div>
  );

export default function ComparisonForm({ onSubmit }: ComparisonFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    usage: "",
    preference: "",
    supplier: "",
    location: "",
  });
  const [customInputs, setCustomInputs] = useState({
    usage: "",
    preference: "",
    supplier: "",
    location: "",
  });
  const [showCustomInput, setShowCustomInput] = useState({
    usage: false,
    preference: false,
    supplier: false,
    location: false,
  });

  const handleSelect = (stepName: keyof typeof selections, option: string) => {
    setSelections(prev => ({ ...prev, [stepName]: option }));

    const stepInfo = steps.find(s => s.name === stepName);
    if(stepInfo?.options.includes(option)){
        setShowCustomInput(prev => ({...prev, [stepName]: false}));
    }

    if (currentStep < steps.length - 1 && stepName === steps[currentStep].name) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleCustomClick = (stepName: keyof typeof showCustomInput) => {
    const newShowState = !showCustomInput[stepName];
    setShowCustomInput(prev => ({ ...prev, [stepName]: newShowState }));
    if(newShowState) {
        handleSelect(stepName as keyof typeof selections, "Custom");
    } else {
        setSelections(prev => ({...prev, [stepName]: ""}));
    }
  };

  const handleCustomInputChange = (stepName: keyof typeof customInputs, value: string) => {
    setCustomInputs(prev => ({...prev, [stepName]: value}));
    if (stepName === 'location') {
      setSelections(prev => ({...prev, location: value}));
    }

     if (currentStep < steps.length - 1 && value.length > 2 && stepName === steps[currentStep].name) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  }
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFinalValue = (stepName: keyof typeof selections) => {
    if (stepName === 'location') {
        return selections.location;
    }
    if (selections[stepName] === "Custom") {
        return customInputs[stepName];
    }
    return selections[stepName];
  }

  const isFormComplete = steps.every(step => getFinalValue(step.name as keyof typeof selections));


  return (
    <div className="space-y-6 relative min-h-[380px]">
        <AnimatePresence mode="wait">
            {steps.map((step, index) => (
                currentStep === index && (
                <motion.div
                    key={step.name}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-4"
                >
                    <div className="flex items-center mb-4">
                        {currentStep > 0 && (
                            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <label className="font-semibold text-foreground text-lg">{step.label}</label>
                    </div>
                    {step.name === 'location' ? (
                       <motion.div 
                            initial={{opacity: 0, height: 0, marginTop: 0}}
                            animate={{opacity: 1, height: 'auto', marginTop: '1rem'}}
                            exit={{opacity: 0, height: 0, marginTop: 0}}
                            className="overflow-hidden"
                        >
                            <Input
                                value={selections.location}
                                onChange={(e) => handleCustomInputChange('location', e.target.value)}
                                placeholder={step.customPlaceholder}
                                className="h-10 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            />
                        </motion.div>
                    ) : (
                        <>
                        <div className={cn("grid gap-2 w-full", "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4")}>
                            {step.options.map(option => {
                                const isSelected = selections[step.name as keyof typeof selections] === option;
                                return (
                                <Button
                                    key={option}
                                    variant={isSelected ? "default" : "outline"}
                                    onClick={() => handleSelect(step.name as keyof typeof selections, option)}
                                    className="rounded-full transition-all duration-200"
                                >
                                    <AnimatePresence>
                                        {isSelected && <motion.div initial={{scale:0}} animate={{scale:1}}><Check className="mr-2 h-4 w-4" /></motion.div>}
                                    </AnimatePresence>
                                    {option}
                                </Button>
                                );
                            })}
                            <Button
                                variant={selections[step.name as keyof typeof selections] === "Custom" ? "default" : "outline"}
                                onClick={() => handleCustomClick(step.name as keyof typeof showCustomInput)}
                                className="rounded-full transition-all duration-200"
                            >
                                {selections[step.name as keyof typeof selections] === "Custom" ? <Check className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                                Custom
                            </Button>
                        </div>
                        
                        <AnimatePresence>
                            {showCustomInput[step.name as keyof typeof showCustomInput] && (
                                <motion.div 
                                    initial={{opacity: 0, height: 0, marginTop: 0}}
                                    animate={{opacity: 1, height: 'auto', marginTop: '1rem'}}
                                    exit={{opacity: 0, height: 0, marginTop: 0}}
                                    className="overflow-hidden"
                                >
                                    <CustomInput
                                    value={customInputs[step.name as keyof typeof customInputs]}
                                    onChange={(e) => handleCustomInputChange(step.name as keyof typeof customInputs, e.target.value)}
                                    placeholder={step.customPlaceholder}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        </>
                    )}
                </motion.div>
                )
            ))}
        </AnimatePresence>

      {isFormComplete && currentStep === steps.length -1 && (
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center pt-4"
        >
          <Button 
            size="lg" 
            className="glowing-btn-border"
            onClick={() => onSubmit({
                usage: getFinalValue('usage'),
                preference: getFinalValue('preference'),
                supplier: getFinalValue('supplier'),
                location: getFinalValue('location'),
            })}
          >
            Analyze Deals
          </Button>
        </motion.div>
      )}
    </div>
  );
}
