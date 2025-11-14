"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { Crown, Zap, Settings, LayoutGrid, ThumbsUp, BarChart3, ShieldCheck, Newspaper, HelpCircle, User, Mail, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { ThemeSwitcher } from '../shared/theme-switcher';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type Section = {
  id: string;
  name: string;
};

type HeaderProps = {
  sections: Section[];
};

const iconMap: { [key: string]: React.ElementType } = {
  hero: Zap,
  services: LayoutGrid,
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


  const NavLink = ({ id, name, icon: Icon }: { id: string; name: string; icon: React.ElementType }) => {
    const isActive = activeId === id;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`#${id}`}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-md",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? 'text-primary' : 'text-muted-foreground/80')} />
              <span className="hidden lg:inline">{name}</span>
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator-desktop"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent className="lg:hidden">
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <motion.div
            animate={controls}
            initial={{ backdropFilter: 'blur(0px)', backgroundColor: 'hsl(var(--background) / 0)' }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full border-b"
        />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="#" className="flex items-center" prefetch={false}>
            <span className="font-headline text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              UtilityKing
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {sections.map(section => {
              const Icon = iconMap[section.id] || HelpCircle;
              return <NavLink key={section.id} id={section.id} name={section.name} icon={Icon} />
            })}
          </nav>
          
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button asChild size="sm" className="hidden md:flex">
                <Link href="#compare">Compare Now</Link>
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
                            <span className="font-headline text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                              UtilityKing
                            </span>
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
                            <Link href="#compare">Compare Now</Link>
                        </Button>
                    </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
  );
}
