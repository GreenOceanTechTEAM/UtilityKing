
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShieldCheck, Home, Package, FileText, BarChart3, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <Home className="h-8 w-8 text-accent" />,
    title: "Protect Your Home",
    description: "Compare buildings and contents insurance to ensure your biggest asset is fully covered for less."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-accent" />,
    title: "Boiler & Appliance Cover",
    description: "Avoid unexpected repair bills. Find affordable cover for your boiler, heating, and home appliances."
  },
  {
    icon: <Package className="h-8 w-8 text-accent" />,
    title: "Bundle and Save",
    description: "Find providers that offer discounts for bundling different types of insurance together."
  }
];

const howItWorks = [
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: "Select Your Cover",
    description: "Choose the type of insurance you need, from home and contents to boiler or appliance cover."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Compare Tailored Quotes",
    description: "We provide clear, unbiased quotes from a range of leading UK insurance providers."
  },
  {
    icon: <Smile className="h-8 w-8 text-accent" />,
    title: "Get Covered Instantly",
    description: "Purchase your policy online in minutes and get immediate peace of mind."
  }
];

const faqs = [
    {
        question: "What's the difference between buildings and contents insurance?",
        answer: "Buildings insurance covers the structure of your home (walls, roof, fixtures). Contents insurance covers your belongings inside the home (furniture, electronics, clothes). You can often buy them together in a combined policy."
    },
    {
        question: "Is boiler cover worth it?",
        answer: "If your boiler is older and out of warranty, cover can save you from a sudden, expensive repair bill, especially in winter. It provides peace of mind and often includes an annual service."
    },
    {
        question: "How can I lower my home insurance premium?",
        answer: "Increasing your voluntary excess, improving home security (e.g., approved locks, alarms), and building a no-claims bonus are all effective ways to reduce your premium. Comparing quotes annually is the best way to ensure you're not overpaying."
    }
];

export default function InsurancePage() {
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
            Protect What Matters, For Less
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
            From home and boiler cover to appliance insurance, compare policies from trusted providers to get the right protection at the best price.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/#compare">Compare Insurance Deals</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Are You Getting the Best Value?</h2>
                <p className="mt-4 text-lg text-muted-foreground">Loyalty rarely pays with insurance. A quick comparison can ensure you're not overpaying for your cover.</p>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Get Covered in 3 Simple Steps</h2>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Insurance FAQs</h2>
                <p className="mt-4 text-lg text-muted-foreground">Your questions on home and appliance insurance, answered.</p>
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
            Get Your Free Insurance Quote
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Answer a few questions to see how much you could save.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/#compare">Get My Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
