"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

type FaqsProps = {
  id: string;
};

const faqItems = [
  {
    question: "How does switching energy suppliers work?",
    answer: "It’s quick and seamless. Your new supplier handles everything — you don’t need to contact your old supplier, and your energy supply continues without interruption."
  },
  {
    question: "How much can I save by switching?",
    answer: "Most UK households save between £200–£350 per year by switching to a cheaper tariff."
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
        <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="font-headline text-3xl md:text-[34px] font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Have questions? We've got answers. Here are some of the most common things people ask.
          </p>
        </motion.div>
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
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground leading-relaxed">
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
