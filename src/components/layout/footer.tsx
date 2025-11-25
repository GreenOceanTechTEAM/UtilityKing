"use client";

import { Crown, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type FooterProps = {
  id: string;
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
}

export default function Footer({ id }: FooterProps) {
  return (
    <motion.footer 
        id={id} 
        className="bg-primary/5 dark:bg-primary/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div variants={itemVariants} className="space-y-4">
             <Link href="/" className="flex items-center justify-center" prefetch={false}>
                <span className="font-headline text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  UtilityKing
                </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              AI-powered utility comparisons to help you save time and money.
            </p>
            <div className="flex justify-center space-x-6">
              <motion.a href="#" whileHover={{ scale: 1.1, y: -2 }} className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-6 w-6" />
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.1, y: -2 }} className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-6 w-6" />
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.1, y: -2 }} className="text-muted-foreground transition-colors hover:text-primary">
                <Linkedin className="h-6 w-6" />
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="mt-12 w-full border-t border-border pt-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Services</h3>
                  <ul className="mt-4 space-y-4">
                    <li><Link href="/energy" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Energy</Link></li>
                    <li><Link href="/gas" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Gas</Link></li>
                    <li><Link href="/broadband" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Broadband</Link></li>
                    <li><Link href="/mobile" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Mobile</Link></li>
                    <li><Link href="/water" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Water</Link></li>
                    <li><Link href="/insurance" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Insurance</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li><Link href="/#compare" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Compare</Link></li>
                    <li><Link href="/#faqs" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>FAQs</Link></li>
                    <li><Link href="/contact" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li><Link href="/about" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>About</Link></li>
                    <li><Link href="/blog" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Blog</Link></li>
                    <li><Link href="/careers" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Careers</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li><Link href="/privacy" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Privacy</Link></li>
                    <li><Link href="/terms" className="text-base text-muted-foreground transition-colors hover:text-primary" prefetch={false}>Terms</Link></li>
                  </ul>
                </div>
            </div>
          </motion.div>
        </div>
        <motion.div variants={itemVariants} className="mt-12 border-t border-border pt-8">
          <p className="text-base text-muted-foreground text-center">&copy; {new Date().getFullYear()} UtilityKing. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}