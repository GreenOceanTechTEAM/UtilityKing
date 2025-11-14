"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntelligentUtilityComparisonOutput, intelligentUtilityComparison } from '@/ai/flows/intelligent-utility-comparison';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Zap, Wifi, Smartphone, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import ComparisonForm from './comparison-form';

type ComparisonDemoProps = {
  id: string;
};

const iconMap: { [key: string]: React.ReactNode } = {
  "Energy": <Zap className="h-5 w-5 text-amber-500" />,
  "Broadband": <Wifi className="h-5 w-5 text-blue-500" />,
  "Mobile": <Smartphone className="h-5 w-5 text-green-500" />,
};

const analysisLines = [
  "Analyzing your preferences...",
  "Checking suppliers...",
  "Calculating savings...",
  "Finding the best deals for you...",
];

const lineVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.8,
      duration: 0.5,
    },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
};


export default function ComparisonDemo({ id }: ComparisonDemoProps) {
  const [comparisonResult, setComparisonResult] = useState<IntelligentUtilityComparisonOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (values: { usage: string; preference: string; location: string; }) => {
    setIsLoading(true);
    setIsFormSubmitted(true);
    setComparisonResult(null);

    const mappedValues = {
        usageData: values.usage,
        preferences: values.preference,
        location: values.location
    }

    try {
      // Fake delay to show animation
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
      setIsFormSubmitted(false); // Allow user to try again
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id={id} className="py-16 sm:py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Find a Better Deal Instantly
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Answer three simple questions. Let our AI find the perfect deal for you.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isFormSubmitted ? 0.5 : 1 }}
                className="transition-opacity duration-300"
            >
              <AnimatePresence mode="wait">
                {isFormSubmitted ? (
                  <motion.div
                    key="analyzing"
                    className="flex flex-col items-center justify-center min-h-[350px] p-8"
                  >
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
                    <div className="relative h-6 w-full max-w-sm overflow-hidden text-center">
                        <AnimatePresence>
                           {analysisLines.map((line, index) => (
                             <motion.p
                                key={line}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={lineVariants}
                                className="absolute inset-0 text-lg text-muted-foreground"
                                style={{ animationDelay: `${index * 1.5}s`, animationDuration: '1.5s' }}
                              >
                                {line}
                              </motion.p>
                           ))}
                        </AnimatePresence>
                    </div>

                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ComparisonForm onSubmit={handleFormSubmit} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
            {comparisonResult && (
                <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="lg:mt-0 mt-8"
                >
                    <div className='text-center mb-4'>
                        <h3 className="text-xl font-semibold text-primary">> Analysis complete. Optimal deals identified:</h3>
                        <p className='text-muted-foreground'>> {comparisonResult.comparisonSummary}</p>
                    </div>

                    <Carousel opts={{ align: "start" }} className="w-full mt-8">
                    <CarouselContent>
                        {comparisonResult.recommendedPlans.map((plan, index) => (
                        <CarouselItem key={index} className="md:basis-1/2">
                             <motion.div
                                custom={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={(i) => ({
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: i * 0.15, type: 'spring', stiffness: 100 }
                                })}
                             >
                                <Card className="flex flex-col h-full bg-card border-border hover:border-primary/80 hover:shadow-lg transition-all">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Badge variant="secondary" className="mb-2">{plan.provider}</Badge>
                                            <CardTitle className="text-lg font-bold text-foreground">{plan.planName}</CardTitle>
                                        </div>
                                        {iconMap[plan.provider] || <Zap className="h-5 w-5 text-amber-500" />}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="text-3xl font-bold font-headline text-foreground">
                                        £{plan.price.toFixed(2)}
                                        <span className="text-base font-normal text-muted-foreground">/month</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Contract: <span className="font-semibold text-card-foreground">{plan.contractLength}</span>
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                                        <Link href={plan.link} target="_blank">View Deal <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                    </Button>
                                </CardFooter>
                                </Card>
                            </motion.div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
