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
import AboutSection from '@/components/sections/about-section';

export default function Home() {
  const sections = [
    { id: 'hero', name: 'Home' },
    { id: 'services', name: 'Services' },
    { id: 'how', name: 'How It Works' },
    { id: 'compare', name: 'Compare' },
    { id: 'why', name: 'Why Us' },
    { id: 'trust', name: 'Reviews' },
    { id: 'faqs', name: 'FAQs' },
    { id: 'blog', name: 'Blog' },
    { id: 'about', name: 'About' },
    { id: 'contact', name: 'Contact' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header sections={sections} />
      <main className="flex-1">
        <ConversationalHero id="hero" />
        <ServicesSection id="services" />
        <HowItWorks id="how" />
        <WhyUtilityKing id="why" />
        <ComparisonDemo id="compare" />
        <TrustProofs id="trust" />
        <AnimatedCTABanner
          id="cta-banner-1"
          type="quote"
          title="Get a smart quote from UKi in 2 minutes"
          buttonText="Start Quoting"
          buttonLink="#compare"
        />
        <FAQs id="faqs" />
        <BlogPreview id="blog" />
        <AboutSection id="about" />
        <AnimatedCTABanner
          id="cta-banner-2"
          type="chat"
          title="Not sure where to start? Ask UKi live."
          buttonText="Chat with UKi"
        />
      </main>
      <Footer id="contact" />
    </div>
  );
}
