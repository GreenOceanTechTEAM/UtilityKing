"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Edit, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonFormProps {
  onSubmit: (values: { usage: string; preference: string; location: string; }) => void;
}

const steps = [
  { 
    name: "usage", 
    label: "Your Usage:", 
    options: ["Small Home", "Medium Home", "Large Home"],
  },
  { 
    name: "preference", 
    label: "Your Preference:", 
    options: ["Cheapest", "Renewable", "Fixed Plan"],
  },
  { 
    name: "location", 
    label: "Your Location:", 
    options: ["Auto Detect", "Postcode", "UK Wide"],
  },
];

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
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
    <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} transition={{ duration: 0.3 }}>
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
    location: "",
  });
  const [customInputs, setCustomInputs] = useState({
    usage: "",
    preference: "",
    location: "",
  });
  const [showCustomInput, setShowCustomInput] = useState({
    usage: false,
    preference: false,
    location: false,
  });

  const handleSelect = (stepName: keyof typeof selections, option: string) => {
    setSelections(prev => ({ ...prev, [stepName]: option }));
    if (option !== "Custom") {
      setShowCustomInput(prev => ({...prev, [stepName]: false}));
    }
    if (currentStep < steps.length -1 && stepName === steps[currentStep].name) {
        setTimeout(() => setCurrentStep(currentStep + 1), 200);
    }
  };

  const handleCustomClick = (stepName: keyof typeof showCustomInput) => {
    setShowCustomInput(prev => ({ ...prev, [stepName]: !prev[stepName] }));
    handleSelect(stepName as keyof typeof selections, "Custom");
  };

  const handleCustomInputChange = (stepName: keyof typeof customInputs, value: string) => {
    setCustomInputs(prev => ({...prev, [stepName]: value}));
  }

  const getFinalValue = (stepName: keyof typeof selections) => {
    if (selections[stepName] === "Custom") {
        return customInputs[stepName];
    }
    return selections[stepName];
  }

  const isFormComplete = steps.every(step => getFinalValue(step.name as keyof typeof selections));


  return (
    <div className="space-y-6">
        <AnimatePresence initial={false}>
            {steps.map((step, index) => (
                currentStep >= index && (
                <motion.div
                    key={step.name}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="p-4 border rounded-lg bg-background/30"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                        <label className="font-semibold text-foreground mb-3 md:mb-0 w-full md:w-32 flex-shrink-0">{step.label}</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
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
                                placeholder={`e.g. ${step.name === 'usage' ? '5-bed house' : step.name === 'preference' ? '18-month contract' : 'SW1A 0AA'}`}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                )
            ))}
        </AnimatePresence>

      {isFormComplete && (
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
