import { Crown, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

type FooterProps = {
  id: string;
};

export default function Footer({ id }: FooterProps) {
  return (
    <footer id={id} className="bg-primary/5 dark:bg-primary/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
             <Link href="#" className="flex items-center" prefetch={false}>
                <span className="font-headline text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  UtilityKing
                </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered utility comparisons to help you save time and money.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary" prefetch={false}>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary" prefetch={false}>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-primary" prefetch={false}>
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Services</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#services" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Energy</Link></li>
                  <li><Link href="#services" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Broadband</Link></li>
                  <li><Link href="#services" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Mobile</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#compare" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Compare</Link></li>
                  <li><Link href="#faqs" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>FAQs</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#about" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>About</Link></li>
                  <li><Link href="#blog" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Blog</Link></li>
                  <li><Link href="#" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Careers</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Privacy</Link></li>
                  <li><Link href="#" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Terms</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-base text-muted-foreground xl:text-center">&copy; {new Date().getFullYear()} Utility King AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
