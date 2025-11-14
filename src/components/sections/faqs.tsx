"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

type FaqsProps = {
  id: string;
};

const faqItems = [
  {
    question: "Is Utility King AI really free to use?",
    answer: "Yes, absolutely. Our service is 100% free for you. We earn a small commission from the provider if you choose to switch through us, but this never affects the price you pay or our impartiality."
  },
  {
    question: "How does the AI comparison work?",
    answer: "Our AI, UKi, analyzes your usage data, location, and preferences against a live database of thousands of deals from UK providers. It then calculates potential savings and recommends the best-value plans for you, saving you the time of manual comparison."
  },
  {
    question: "Is my personal data safe?",
    answer: "We take data privacy very seriously. We use industry-standard encryption and security practices to protect your information. We only share the necessary details with your chosen provider when you decide to switch."
  },
  {
    question: "How long does it take to switch providers?",
    answer: "The switching process is surprisingly quick and handled entirely by your new provider. For energy, it typically takes up to 21 days. For broadband, it can be as fast as a few days, depending on the connection type."
  },
  {
    question: "Will I lose service if I switch?",
    answer: "No, the switching process is designed to be seamless. There should be no interruption to your energy or broadband supply."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function FAQs({ id }: FaqsProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Have questions? We've got answers. Here are some of the most common things people ask.
          </p>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
