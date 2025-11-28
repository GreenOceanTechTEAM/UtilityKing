
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Flame, Thermometer, CalendarCheck, FileText, BarChart3, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <Flame className="h-8 w-8 text-accent" />,
    title: "Lower Your Bills",
    description: "Gas prices fluctuate. We help you find and lock in the most competitive rates available."
  },
  {
    icon: <Thermometer className="h-8 w-8 text-accent" />,
    title: "Stay Warm for Less",
    description: "Secure a cheaper tariff before winter hits and enjoy peace of mind."
  },
  {
    icon: <CalendarCheck className="h-8 w-8 text-accent" />,
    title: "Boiler Cover Options",
    description: "Some tariffs come with boiler cover, giving you extra protection and value."
  }
];

const howItWorks = [
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: "Enter Your Postcode",
    description: "Let us know where you are so we can find the gas suppliers that serve your area."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Compare Gas Tariffs",
    description We'll show you a clear, easy-to-understand list of the best gas deals available to you."
  },
  {
    icon: <Smile className="h-8 w-8 text-accent" />,
    title: "Switch and Relax",
    description: "Choose your new plan and your new supplier will take care of the entire switching process."
  }
];

const faqs = [
    {
        question: "Can I switch only my gas supplier?",
        answer: "Yes, absolutely. You can switch your gas and electricity suppliers separately (dual fuel) or just one of them. We'll show you the best options for both."
    },
    {
        question: "What is a 'standing charge' on my gas bill?",
        answer: "A standing charge is a fixed daily amount you pay for your gas supply, regardless of how much you use. We help you compare these charges as they vary between suppliers."
    },
    {
        question: "I have a prepayment meter. Can I still switch?",
        answer: "Yes, in most cases you can still switch suppliers even if you have a prepayment meter. We'll show you the tariffs available for your meter type."
    }
];

export default function GasPage() {
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
            Lower Your Gas Bills This Winter
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
            Compare the latest gas tariffs from UK suppliers. Find a cheaper fixed rate and protect your home from rising prices.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/#compare">Compare Gas Deals</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Switch Your Gas Supplier?</h2>
                <p className="mt-4 text-lg text-muted-foreground">Don't let your heating bills creep up. A quick comparison could save you hundreds.</p>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Switching is Simple</h2>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Gas Switching FAQs</h2>
                <p className="mt-4 text-lg text-muted-foreground">Your questions on gas tariffs, answered.</p>
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
            Check Your Postcode for Cheaper Gas
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Get a personalized quote in under 60 seconds.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/#compare">Find My Best Gas Price</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
