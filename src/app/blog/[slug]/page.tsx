'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import Image from 'next/image';

// This is a placeholder. In a real app, you'd fetch this data based on the slug.
const blogPost = {
    title: "5 Ways to Instantly Reduce Your Energy Bills (Backed by Data)",
    category: "Energy",
    image: PlaceHolderImages.find(p => p.id === "blog-post-1"),
    excerpt: "Featured tips, expert advice, and energy-saving insights updated weekly.",
    author: "Jane Doe",
    date: "October 26, 2023",
    content: `
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
<p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.</p>
<h3 class="font-bold text-xl my-4">Understanding Your Energy Bill</h3>
<p>Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis.</p>
`
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  if (!blogPost) {
    return <div>Post not found</div>;
  }

  return (
    <div className="bg-background py-16 sm:py-24">
        <motion.div 
            className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-8">
                <p className="text-base font-semibold text-accent">{blogPost.category}</p>
                <h1 className="mt-2 block text-3xl font-bold leading-8 tracking-tight text-foreground sm:text-4xl">
                    {blogPost.title}
                </h1>
                <p className="mt-4 text-base text-muted-foreground">
                    By {blogPost.author} on {blogPost.date}
                </p>
            </div>

            {blogPost.image && (
                <div className="aspect-video overflow-hidden rounded-lg shadow-xl mb-8">
                    <Image
                        src={blogPost.image.imageUrl}
                        alt={blogPost.image.description}
                        width={1200}
                        height={675}
                        className="h-full w-full object-cover"
                        priority
                    />
                </div>
            )}
            
            <div
                className="prose prose-lg mx-auto max-w-none text-foreground prose-h3:text-foreground prose-p:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />
      </motion.div>
    </div>
  );
}