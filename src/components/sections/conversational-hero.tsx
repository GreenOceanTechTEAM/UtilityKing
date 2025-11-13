"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { conversationalHeroAssistance, ConversationalHeroAssistanceOutput } from '@/ai/flows/conversational-hero-assistance';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import ParticleBackground from '../shared/particle-background';

type ConversationalHeroProps = {
  id: string;
};

const formSchema = z.object({
  userInput: z.string().min(10, {
    message: "Please describe what you're looking for.",
  }),
});

export default function ConversationalHero({ id }: ConversationalHeroProps) {
  const [assistance, setAssistance] = useState<ConversationalHeroAssistanceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInput: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAssistance(null);
    try {
      const result = await conversationalHeroAssistance(values);
      setAssistance(result);
    } catch (error) {
      console.error("Hero assistance failed:", error);
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: "Sorry, I couldn't process that request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id={id} className="relative flex h-[90vh] min-h-[700px] items-center justify-center overflow-hidden text-primary-foreground">
      <ParticleBackground />
      <div className="absolute inset-0 z-[-1] bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div>
          <Badge variant="secondary" className="mb-4 text-sm bg-background/20 text-foreground backdrop-blur-sm border-0">
             <Sparkles className="mr-2 h-4 w-4 text-accent" /> AI-Powered Comparisons
          </Badge>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            AI-Powered Energy Comparison: Find Your Best Rate in Seconds.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-foreground/90">
            Stop overpaying on electricity. UKi compares rates for you in seconds, saving you time and money.
          </p>
        </div>

        <div
          className="mt-10 mx-auto max-w-xl"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={form.control}
                name="userInput"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g., 'Find me a cheaper energy deal in London'"
                        className="h-12 text-base text-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-left text-destructive" />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="h-12" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Compare Plans'
                )}
              </Button>
            </form>
          </Form>

          {assistance && (
            <div
              className="mt-6 p-4 rounded-lg bg-background/20 backdrop-blur-sm text-left"
            >
              <p className="text-sm font-medium text-primary-foreground">{assistance.aiResponse}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {assistance.suggestedServices.map(service => (
                  <Button key={service} asChild size="sm" variant="secondary">
                     <Link href="#services">{service}</Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
