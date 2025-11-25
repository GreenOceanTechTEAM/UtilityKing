import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  return (
    <>
      <Header sections={sections} />
      <main className="flex-1">{children}</main>
      <Footer id="footer" />
    </>
  );
}