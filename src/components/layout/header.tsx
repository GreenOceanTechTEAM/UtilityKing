"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { Crown, Zap, Settings, Database, ThumbsUp, BarChart3, ShieldCheck, Newspaper, HelpCircle, User, Mail, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../ui/button';

type Section = {
  id: string;
  name: string;
};

type HeaderProps = {
  sections: Section[];
};

const iconMap: { [key: string]: React.ElementType } = {
  hero: Zap,
  how: Settings,
  services: Database,
  why: ThumbsUp,
  compare: BarChart3,
  trust: ShieldCheck,
  blog: Newspaper,
  faqs: HelpCircle,
  about: User,
  contact: Mail,
};

export default function Header({ sections }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sectionIds = sections.map(s => s.id);
  const activeId = useScrollSpy(sectionIds, {
    rootMargin: '0% 0% -80% 0%',
  });

  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    controls.start({
      backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
      backgroundColor: scrolled ? 'hsl(var(--background) / 0.7)' : 'hsl(var(--background) / 0)',
    });
  }, [scrolled, controls]);

  const NavLink = ({ id, name }: { id: string, name: string }) => {
    const Icon = iconMap[id] || HelpCircle;
    const isActive = activeId === id;
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300',
              isActive ? 'text-accent-foreground' : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
            )}
            >
            <Link href={`#${id}`} className="flex h-full w-full items-center justify-center">
              <Icon className="h-5 w-5" />
            </Link>
            {isActive && (
              <motion.div
                layoutId="active-nav-indicator"
                className="absolute inset-0 z-[-1] rounded-lg bg-accent"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    );
  };
  
  return (
    <TooltipProvider>
      <motion.header
        animate={controls}
        initial={{ backdropFilter: 'blur(0px)', backgroundColor: 'hsl(var(--background) / 0)' }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 border-b"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <Crown className="h-8 w-8 text-primary" />
            <span className="hidden text-xl font-bold font-headline text-foreground sm:inline">Utility King AI</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center space-x-2 rounded-full border bg-background/50 p-1 md:flex">
            {sections.slice(0, -1).map(section => (
                <NavLink key={section.id} id={section.id} name={section.name} />
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden md:flex">
                <Link href="#contact">Get in Touch</Link>
            </Button>

            {/* Mobile Nav */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col h-full">
                        <Link href="#" className="flex items-center gap-2 mb-8" prefetch={false} onClick={() => setIsMobileMenuOpen(false)}>
                            <Crown className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold font-headline text-foreground">Utility King AI</span>
                        </Link>
                        <div className="flex flex-col space-y-3">
                        {sections.map(({ id, name }) => {
                            const Icon = iconMap[id] || HelpCircle;
                            return (
                                <Link
                                    key={id}
                                    href={`#${id}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md p-3 text-lg font-medium transition-colors",
                                        activeId === id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted'
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {name}
                                </Link>
                            );
                        })}
                        </div>
                        <Button asChild className="mt-auto" onClick={() => setIsMobileMenuOpen(false)}>
                            <Link href="#contact">Get in Touch</Link>
                        </Button>
                    </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    </TooltipProvider>
  );
}
