
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Zap, ShieldCheck, Leaf, FileText, BarChart3, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <Zap className="h-8 w-8 text-accent" />,
    title: "Huge Savings",
    description: "Our users save an average of £350 per year on their electricity and gas bills."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-accent" />,
    title: "Price Security",
    description: "Lock in a fixed rate to protect yourself from future energy price hikes."
  },
  {
    icon: <Leaf className="h-8 w-8 text-accent" />,
    title: "Go Green",
    description: "Find competitive tariffs from 100% renewable energy suppliers at no extra cost."
  }
];

const howItWorks = [
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: "Tell Us About Your Usage",
    description: "Provide a few details about your current energy spend or usage to get accurate quotes."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Compare Live Tariffs",
    description: "We analyze hundreds of the latest gas and electricity tariffs from a wide range of UK suppliers."
  },
  {
    icon: <Smile className="h-8 w-8 text-accent" />,
    title: "Switch & Save in Minutes",
    description: "Choose the best deal and switch online. Your new supplier handles the rest with no interruption."
  }
];

const faqs = [
    {
        question: "Will my power be cut off when I switch?",
        answer: "No, never. The switch is a seamless background process. Your new supplier uses the same pipes and wires as your old one, so you'll never be without gas or electricity."
    },
    {
        question: "How long does it take to switch energy suppliers?",
        answer: "The switch is usually completed within 5 working days, thanks to the Energy Switch Guarantee. You also have a 14-day cooling-off period to change your mind."
    },
    {
        question: "Do I need to contact my old supplier?",
        answer: "No, you don't. Your new supplier will handle the entire process for you, including contacting your old supplier to let them know you're leaving."
    }
];

export default function EnergyPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-20 md:py-28 text-center bg-primary/5 dark:bg-primary/10"
      >
        <div className="container mx-auto px-4 pt-16">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find Cheaper, Greener Energy Today
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
            Stop overpaying for gas and electricity. Compare live tariffs from trusted UK suppliers and switch to a better deal in minutes.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/#compare">Compare Energy Deals</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Switch Your Energy Supplier?</h2>
                <p className="mt-4 text-lg text-muted-foreground">Switching is fast, free, and could be one of the easiest ways to reduce your household bills.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {benefits.map(item => (
                    <Card key={item.title} className="text-center p-6">
                        <div className="flex justify-center mb-4">{item.icon}</div>
                        <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-2 text-muted-foreground">{item.description}</p>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-primary/5 dark:bg-primary/10">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">An Easier Way to Switch</h2>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {howItWorks.map((step, index) => (
                    <div key={step.title} className="p-6">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-background shadow-md mx-auto mb-4">
                            <span className="text-xl font-bold text-accent">{index + 1}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                        <p className="mt-2 text-muted-foreground">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Energy FAQs</h2>
                <p className="mt-4 text-lg text-muted-foreground">Your energy switching questions, answered.</p>
            </div>
             <Accordion type="single" collapsible className="w-full mt-12">
                {faqs.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                        {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                        {item.answer}
                    </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center bg-primary/10 dark:bg-primary/20 rounded-xl p-10">
           <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to See Your Savings?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Get your personalized quote in under 60 seconds.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/#compare">Start Comparing Now</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
