"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';

type BlogPreviewProps = {
  id: string;
};

const blogPosts = [
  {
    title: "5 Common Mistakes to Avoid When Switching Energy Suppliers",
    category: "Energy",
    image: PlaceHolderImages.find(p => p.id === "blog-post-1"),
    excerpt: "Switching can save you hundreds, but pitfalls exist. Here's what to watch out for to ensure you get the best deal without the headache."
  },
  {
    title: "Is Your Broadband Really 'Superfast'? A Guide to UK Speeds",
    category: "Broadband",
    image: PlaceHolderImages.find(p => p.id === "blog-post-2"),
    excerpt: "We break down the jargon from ADSL to full-fibre so you can understand if you're getting the speed you pay for."
  },
  {
    title: "How Smart Meters Are Changing the Way We Use Energy",
    category: "Smart Tech",
    image: PlaceHolderImages.find(p => p.id === "blog-post-3"),
    excerpt: "Discover the real benefits of smart meters, from accurate billing to helping you reduce your carbon footprint."
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
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function BlogPreview({ id }: BlogPreviewProps) {
  return (
    <section id={id} className="py-16 sm:py-24 bg-primary/5 dark:bg-primary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
            initial={{ opacity: 0, letterSpacing: "-0.05em" }}
            whileInView={{ opacity: 1, letterSpacing: "0em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "power2.out" }}
            className="text-center"
        >
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From Our Blog
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Get the latest tips, tricks, and insights on managing your utilities and saving money.
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {blogPosts.map((post) => (
            <motion.div key={post.title} variants={itemVariants} className="flex">
              <Card className="group flex flex-col h-full overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {post.image && (
                  <motion.div className="aspect-video overflow-hidden" whileHover={{
                    transform: "rotateY(-5deg) rotateX(5deg) scale(1.05)",
                  }}>
                      <Image
                      src={post.image.imageUrl}
                      alt={post.image.description}
                      width={600}
                      height={338}
                      data-ai-hint={post.image.imageHint}
                      className="h-full w-full object-cover"
                      />
                  </motion.div>
                )}
                <CardContent className="flex-1 p-6">
                  <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                  <h3 className="font-headline text-xl font-semibold text-foreground">{post.title}</h3>
                  <p className="mt-3 text-base text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link href="#" className="group flex items-center gap-2 font-semibold text-accent hover:text-accent/80" prefetch={false}>
                    <span className="relative">
                      Read more
                      <motion.span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                    </span>
                    <motion.div whileHover={{ x: 2 }}>
                        <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
