"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { intelligentUtilityComparison, IntelligentUtilityComparisonOutput } from '@/ai/flows/intelligent-utility-comparison';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Loader2, Zap, Wifi, Smartphone, ArrowRight, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '../ui/badge';

type ComparisonDemoProps = {
  id: string;
};

const formSchema = z.object({
  usageData: z.string().min(5, "Please describe your usage (e.g., '2-person household, work from home')."),
  preferences: z.string().min(5, "Tell us what's important (e.g., 'fastest internet, green energy')."),
  location: z.string().min(2, "Please enter your city or postcode."),
});

export default function ComparisonDemo({ id }: ComparisonDemoProps) {
  const [comparisonResult, setComparisonResult] = useState<IntelligentUtilityComparisonOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usageData: "",
      preferences: "",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setComparisonResult(null);
    try {
      const result = await intelligentUtilityComparison(values);
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
  }
  
  const iconMap: { [key: string]: React.ReactNode } = {
    "Energy": <Zap className="h-5 w-5 text-amber-500" />,
    "Broadband": <Wifi className="h-5 w-5 text-blue-500" />,
    "Mobile": <Smartphone className="h-5 w-5 text-green-500" />,
  };

  return (
    <section id={id} className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
          <div className="lg:sticky lg:top-24">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Find a Better Deal Instantly
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Enter your details below, and UKi will analyze your options to find the best deals for you.
            </p>
            <Card className="mt-8 shadow-lg">
                <CardContent className="p-6">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="usageData"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Usage</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 3-bed house, 2 adults, heavy streaming" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="preferences"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Preferences</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Cheapest 12-month contract, 100% renewable" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Location</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Manchester or M1 1AA" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Deals...
                            </>
                        ) : (
                            'Compare Now'
                        )}
                        </Button>
                    </form>
                    </Form>
              </CardContent>
            </Card>
          </div>

          <div className="min-h-[500px]">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/50 p-8 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 font-semibold text-foreground">UKi is searching thousands of deals...</p>
                <p className="text-sm text-muted-foreground">This may take a moment.</p>
              </div>
            )}

            {!isLoading && comparisonResult && (
              <div>
                <h3 className="font-headline text-2xl font-bold">Your Recommended Plans</h3>
                <p className="mt-2 text-muted-foreground">{comparisonResult.comparisonSummary}</p>
                
                <Carousel opts={{ align: "start" }} className="w-full mt-8">
                  <CarouselContent>
                    {comparisonResult.recommendedPlans.map((plan, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-full xl:basis-1/2">
                        <div className="p-1">
                          <Card className="flex flex-col h-full shadow-md hover:shadow-xl transition-shadow">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                  <div>
                                    <Badge variant="outline" className="mb-2">{plan.provider}</Badge>
                                    <CardTitle className="text-lg font-bold">{plan.planName}</CardTitle>
                                  </div>
                                  {iconMap[plan.provider] || iconMap['Energy']}
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <div className="text-3xl font-bold font-headline">
                                    £{plan.price.toFixed(2)}
                                    <span className="text-base font-normal text-muted-foreground">/month</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Contract: <span className="font-semibold text-foreground">{plan.contractLength}</span>
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={plan.link} target="_blank">View Deal <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              </div>
            )}
            
            {!isLoading && !comparisonResult && (
                 <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/50 p-8 text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-semibold text-foreground">Your comparison results will appear here.</p>
                    <p className="text-sm text-muted-foreground">Fill out the form to get started.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
