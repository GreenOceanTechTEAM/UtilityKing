
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Droplets, Gauge, HelpingHand, FileText, BarChart3, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: <Droplets className="h-8 w-8 text-accent" />,
    title: "Check Your Eligibility",
    description: "For businesses and some households with meters, switching water supplier is possible and can lead to big savings."
  },
  {
    icon: <Gauge className="h-8 w-8 text-accent" />,
    title: "Save with a Water Meter",
    description: "If you have more bedrooms than people in your home, you could save hundreds per year by switching to a water meter."
  },
  {
    icon: <HelpingHand className="h-8 w-8 text-accent" />,
    title: "Social Tariffs & Support",
    description: "We can help you check if you're eligible for social tariffs or other support schemes to reduce your water bills."
  }
];

const howItWorks = [
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: "Understand Your Bill",
    description: "Learn about your charges and whether you're eligible to switch suppliers or apply for support schemes."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Compare Business Retailers",
    description: "For eligible businesses, we compare water and wastewater retailers to find you better service and prices."
  },
  {
    icon: <Smile className="h-8 w-8 text-accent" />,
    title: "Reduce Your Usage",
    description: "Get access to free water-saving devices and tips to lower your consumption and your bills."
  }
];

const faqs = [
    {
        question: "Can I switch my household water supplier?",
        answer: "For most households in England and Wales, you cannot switch your water and sewerage company. However, if you're a business, charity, or public sector organisation, you can choose your water retailer. We can help you check your eligibility."
    },
    {
        question: "How can I save money on my water bill if I can't switch?",
        answer: "The single best way is to switch to a water meter. It's free to have one installed, and if your bills don't go down, you can usually switch back within 12-24 months. You can also apply for social tariffs or get free water-saving gadgets."
    },
    {
        question: "What is a water retailer?",
        answer: "In the business water market, the retailer is the company that sends you your bill, takes meter readings, and handles customer service. The wholesaler still manages the pipes. Switching retailers can get you a better price and service."
    }
];

export default function WaterPage() {
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
            Uncover Savings on Your Water Bill
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
            While most homes can't switch water supplier, you can still save. Find out if a water meter is right for you or, for businesses, compare retailers.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/#compare">Explore Water Savings</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Ways to Reduce Your Water Bill</h2>
                <p className="mt-4 text-lg text-muted-foreground">From meters to social tariffs, there are several effective ways to cut your water costs.</p>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Your Path to Cheaper Water</h2>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Water Bill FAQs</h2>
                <p className="mt-4 text-lg text-muted-foreground">Your questions on water charges and switching, answered.</p>
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
            Could You Be Saving on Water?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Use our smart tools to find out if you're eligible for savings.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/#compare">Check My Water Options</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
