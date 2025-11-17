
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, ChevronRight, User, Mail, Building, Briefcase, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type ContactSectionProps = {
  id: string;
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  isBusiness: z.boolean().default(false),
  businessName: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters long.").max(500, "Message must be less than 500 characters."),
}).refine(data => !data.isBusiness || (data.isBusiness && data.businessName && data.businessName.length > 0), {
  message: "Business name is required for business inquiries",
  path: ["businessName"],
});


const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } }
};

const steps = [
    { field: "name", title: "Let's start with your name.", placeholder: "John Doe", icon: User },
    { field: "email", title: "What's your email address?", placeholder: "john.doe@example.com", icon: Mail },
    { field: "isBusiness", title: "Is this a business inquiry?", icon: Briefcase },
    { field: "message", title: "How can we help you today?", placeholder: "Your message here...", icon: Send, isTextarea: true },
];

const triggerMessages = [
    { text: "My bill is too high" },
    { text: "My broadband is too slow" },
    { text: "I'm having trouble switching" },
];

export default function ContactSection({ id }: ContactSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const { firestore } = useFirebase();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      isBusiness: false,
      businessName: "",
      message: "",
    },
    mode: "onChange"
  });

  const isBusiness = form.watch("isBusiness");

  const activeSteps = isBusiness 
    ? [...steps.slice(0,3), { field: "businessName", title: "What's your business name?", placeholder: "ACME Inc.", icon: Building }, ...steps.slice(3)] 
    : steps;
    
  const handleNextStep = async () => {
    const currentField = activeSteps[currentStep].field as keyof z.infer<typeof formSchema>;
    
    let isValid = await form.trigger(currentField);
    
    if (isValid && currentStep < activeSteps.length - 1) {
        setCurrentStep(currentStep + 1);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (activeSteps[currentStep].field !== 'message') {
            handleNextStep();
        }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isValid = await form.trigger();
    if (!isValid) {
      for(let i=0; i< activeSteps.length; i++) {
        const stepField = activeSteps[i].field as keyof z.infer<typeof formSchema>;
        const fieldState = form.getFieldState(stepField);
        if(fieldState.invalid) {
          setCurrentStep(i);
          return;
        }
      }
      return;
    };

    setIsLoading(true);
    
    try {
      if (!firestore) {
        throw new Error("Firestore is not initialized");
      }
      const submissionsCollection = collection(firestore, 'contact_submissions');
      await addDoc(submissionsCollection, {
        ...values,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll get back to you shortly.",
      });
      form.reset();
      setCurrentStep(0);
    } catch (error) {
       console.error("Error writing document: ", error);
       toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
       });
    } finally {
      setIsLoading(false);
    }
  }
  
  const progress = ((currentStep + 1) / activeSteps.length) * 100;

  const handleIsBusinessChange = (checked: boolean) => {
    form.setValue('isBusiness', checked, { shouldValidate: true });
    // Reset businessName if unchecked
    if (!checked) {
      form.setValue('businessName', '', { shouldValidate: false });
    }
  }

  const handleTriggerMessageClick = (message: string) => {
    form.setValue('message', message, { shouldValidate: true });
  }

  const renderStep = () => {
    const stepConfig = activeSteps[currentStep];
    const Icon = stepConfig.icon;
    
    if (stepConfig.field === 'isBusiness') {
        return (
             <motion.div
                key="isBusinessStep"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm mx-auto flex flex-col items-center"
             >
                <div 
                    className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm w-full cursor-pointer hover:bg-muted/50"
                    onClick={() => handleIsBusinessChange(!isBusiness)}
                >
                    <Checkbox
                        id="is-business-checkbox"
                        checked={isBusiness}
                        onCheckedChange={handleIsBusinessChange}
                    />
                    <FormLabel htmlFor='is-business-checkbox' className="cursor-pointer font-normal text-base">
                        This is a business inquiry
                    </FormLabel>
                </div>
             </motion.div>
        )
    }

    return (
        <FormField
            control={form.control}
            name={stepConfig.field as any}
            render={({ field }) => (
                <FormItem className="w-full max-w-sm mx-auto">
                    <FormControl>
                         <div className="relative">
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            {stepConfig.isTextarea ? (
                                <Textarea placeholder={stepConfig.placeholder} {...field} onKeyDown={handleKeyDown} rows={4} className="pl-10 text-base" />
                            ) : (
                                <Input placeholder={stepConfig.placeholder} {...field} onKeyDown={handleKeyDown} className="pl-10 h-12 text-base" autoFocus/>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
  }

  return (
    <section id={id} className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Have a Question? Let's Talk.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Whether you're a potential customer, a business partner, or just curious, we'd love to hear from you.
          </p>
        </motion.div>

        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="w-full bg-primary/10 rounded-full h-1.5 mb-8">
                    <motion.div 
                        className="bg-primary h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%`}}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                <div className="relative h-[200px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            variants={stepVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="absolute w-full"
                        >
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold text-foreground">{activeSteps[currentStep].title}</h3>
                            </div>
                            {renderStep()}
                            {activeSteps[currentStep].field === 'message' && (
                              <motion.div 
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0, transition: {delay: 0.3}}}
                                className="flex flex-wrap gap-2 justify-center mt-4 max-w-sm mx-auto"
                              >
                                {triggerMessages.map(msg => (
                                  <Button
                                    key={msg.text}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-auto py-1.5"
                                    onClick={() => handleTriggerMessageClick(msg.text)}
                                  >
                                    <Sparkles className="w-3 h-3 mr-2 text-accent" />
                                    {msg.text}
                                  </Button>
                                ))}
                              </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  {currentStep < activeSteps.length - 1 ? (
                    <Button type="button" size="lg" onClick={handleNextStep} disabled={activeSteps[currentStep].field === 'isBusiness'}>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </section>
  );
}
