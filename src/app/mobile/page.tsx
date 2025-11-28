
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Smartphone, Signal, Box, FileText, BarChart3, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <Smartphone className="h-8 w-8 text-accent" />,
    title: "More Data for Less",
    description: "Get generous data allowances, including unlimited plans, at a much lower monthly cost."
  },
  {
    icon: <Signal className="h-8 w-8 text-accent" />,
    title: "Better Coverage",
    description: "Switch to a network with stronger 5G and 4G coverage in your area for a more reliable connection."
  },
  {
    icon: <Box className="h-8 w-8 text-accent" />,
    title: "Flexible SIM-Only Deals",
    description: "Keep your current phone and switch to a cheap, flexible 30-day or 12-month SIM-only plan."
  }
];

const howItWorks = [
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: "Tell Us What You Need",
    description: "Let us know how much data you use, and whether you need texts and minutes, to find your perfect plan."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Compare Mobile & SIM Plans",
    description: "We'll show you the best SIM-only and contract deals from all the major UK networks."
  },
  {
    icon: <Smile className="h-8 w-8 text-accent" />,
    title: "Switch & Keep Your Number",
    description: "Switching is as simple as sending a text. You can keep your number and be active on your new plan in 1 day."
  }
];

const faqs = [
    {
        question: "Can I keep my current mobile number?",
        answer: "Yes, it's easy! Thanks to 'Text-to-Switch', you just send a free text to get your PAC code. Give this to your new provider, and they'll transfer your number, usually within one working day."
    },
    {
        question: "What's the difference between a contract and a SIM-only deal?",
        answer: "A contract (pay monthly) includes the cost of a new handset spread over the plan's length (usually 24 months). A SIM-only deal is just for the data, calls, and texts, and you use your existing phone. SIM-only is almost always cheaper."
    },
    {
        question: "Will I need to unlock my phone to switch?",
        answer: "Most phones sold in the last few years are already unlocked. If you're unsure, you can ask your current provider. If it is locked, they are obligated to unlock it for you for free."
    }
];

export default function MobilePage() {
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
            The Smart Way to Compare Mobile Deals
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
            Stop paying too much for your mobile plan. Compare the best SIM-only and contract deals from all major UK networks.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/#compare">Compare Mobile Deals</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Switch Your Mobile Plan?</h2>
                <p className="mt-4 text-lg text-muted-foreground">You could get more data, better coverage, and a lower monthly bill in just a few clicks.</p>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">A Better Mobile Deal in 3 Steps</h2>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Mobile & SIM FAQs</h2>
                <p className="mt-4 text-lg text-muted-foreground">Get answers to your questions about switching mobile plans.</p>
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
            Ready to Lower Your Phone Bill?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Compare hundreds of SIM-only and contract deals in seconds.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/#compare">Compare Mobile Plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
