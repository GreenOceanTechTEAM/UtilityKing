
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Wifi, Zap, Gem, FileText, BarChart3, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <Zap className="h-8 w-8 text-accent" />,
    title: "Ultrafast Speeds",
    description: "Stop waiting. Find full-fibre deals with speeds up to 1,000Mbps for seamless streaming and gaming."
  },
  {
    icon: <Gem className="h-8 w-8 text-accent" />,
    title: "Better Value",
    description: "Many providers offer faster speeds for less than you're currently paying. Don't miss out."
  },
  {
    icon: <Wifi className="h-8 w-8 text-accent" />,
    title: "Improved Reliability",
    description: "Upgrade from old copper lines to a more stable and reliable full-fibre connection."
  }
];

const howItWorks = [
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: "Check Your Postcode",
    description: "Enter your postcode to see exactly which broadband providers and speeds are available at your address."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Compare Broadband Deals",
    description: "Filter deals by speed, price, contract length, and provider to find the perfect plan for your needs."
  },
  {
    icon: <Smile className="h-8 w-8 text-accent" />,
    title: "Switch Hassle-Free",
    description: "Once you choose, your new provider manages the switch. It's often as simple as plugging in a new router."
  }
];

const faqs = [
    {
        question: "Will my internet go down during the switch?",
        answer: "There's usually very little downtime. In many cases, your new service will be activated on the same day your old one ends. For full-fibre installations, an engineer visit may be required, but this is scheduled with you."
    },
    {
        question: "Can I keep my landline phone number?",
        answer: "Yes, in most cases you can transfer your existing landline number to your new provider. We will guide you through this process during the switch."
    },
    {
        question: "What broadband speed do I actually need?",
        answer: "It depends on your usage. For general browsing and streaming, 50-100Mbps is great. For busy households with multiple devices, gamers, or home workers, 100Mbps+ is recommended. Full-fibre (up to 1,000Mbps) is best for future-proofing."
    }
];

export default function BroadbandPage() {
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
            Get Faster, Cheaper Broadband
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
            Tired of buffering? Compare the latest full-fibre and superfast broadband deals in your area and switch to a better plan today.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/#compare">Compare Broadband Deals</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Switch Your Broadband?</h2>
                <p className="mt-4 text-lg text-muted-foreground">You could be getting faster, more reliable internet for a fraction of the cost you're paying now.</p>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Find a Better Deal in 3 Steps</h2>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Broadband FAQs</h2>
                <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about switching.</p>
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
            Ready for a Speed and Price Boost?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Check the available deals at your address now.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/#compare">Compare Broadband Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
