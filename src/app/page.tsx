
"use client";

import React, { useRef, useCallback, useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ConversationalHero from '@/components/sections/conversational-hero';
import HowItWorks from '@/components/sections/how-it-works';
import AnimatedCTABanner from '@/components/shared/animated-cta-banner';
import ServicesSection from '@/components/sections/services-section';
import WhyUtilityKing from '@/components/sections/why-utility-king';
import ComparisonDemo from '@/components/sections/comparison-demo';
import TrustProofs from '@/components/sections/trust-proofs';
import FAQs from '@/components/sections/faqs';
import BlogPreview from '@/components/sections/blog-preview';
import { AboutSection } from '@/components/sections/about-section';
import ContactSection from '@/components/sections/contact-section';

// Create a context to hold the reset function
export const ComparisonResetContext = React.createContext<(() => void) | null>(null);

export default function Home() {
  const sections = [
    { id: 'hero', name: 'Home' },
    { id: 'how', name: 'How it Works' },
    { id: 'services', name: 'Services' },
    { id: 'why', name: 'Why Us' },
    { id: 'compare', name: 'Compare' },
    { id: 'trust', name: 'Reviews' },
    { id: 'faqs', name: 'FAQs' },
    { id: 'blog', name: 'Blog' },
    { id: 'about', name: 'About' },
    { id: 'contact', name: 'Contact' },
  ];
  
  const [premisesType, setPremisesType] = useState('Home');
  const comparisonResetRef = useRef<() => void | null>(null);

  const setComparisonReset = useCallback((resetFn: () => void) => {
    comparisonResetRef.current = resetFn;
  }, []);

  const triggerReset = useCallback(() => {
    if (comparisonResetRef.current) {
      comparisonResetRef.current();
    }
  }, []);

  return (
    <ComparisonResetContext.Provider value={triggerReset}>
      <div className="flex min-h-screen w-full flex-col">
        <Header sections={sections} />
        <main className="flex-1">
          <ConversationalHero id="hero" />
          <HowItWorks id="how" premisesType={premisesType}/>
          <ServicesSection id="services" />
          <WhyUtilityKing id="why" />
          <ComparisonDemo id="compare" />
          <TrustProofs id="trust" />
          <AnimatedCTABanner
            id="cta-banner-1"
            type="quote"
            title="Compare Live UK Energy Prices — Get Your Smart Quote Today"
            subtitle="Energy prices change daily. Grab today’s lowest deal before rates increase again."
            buttonText="Check My Best Price"
            buttonLink="#compare"
            onClick={triggerReset}
          />
          <FAQs id="faqs" />
          <BlogPreview id="blog" />
          <AboutSection id="about" />
          <AnimatedCTABanner
            id="cta-banner-2"
            type="chat"
            title="Not sure where to start? Ask UKi live."
            subtitle="Our AI assistant is here to help you 24/7."
            buttonText="Chat with UKi"
          />
          <ContactSection id="contact" />
        </main>
        <Footer id="footer-contact" />
      </div>
    </ComparisonResetContext.Provider>
  );
}
