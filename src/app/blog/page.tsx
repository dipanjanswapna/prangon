
'use client';

import { motion } from 'framer-motion';
import { Rss, Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { posts } from '@/lib/blog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};


export default function BlogPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative text-center mb-16 rounded-lg overflow-hidden"
        >
          <div className="py-16 md:py-24">
            <Image
              src="https://wallpapercat.com/w/full/d/d/f/46447-3840x2160-desktop-4k-squid-game-wallpaper.jpg"
              alt="Blog background"
              fill
              className="absolute inset-0 z-0 object-cover opacity-25"
              data-ai-hint="abstract technology background"
            />
            <div className="relative z-10">
                <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
                   <Rss className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-primary uppercase">
                  The Blog
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mt-4 max-w-4xl mx-auto">
                  Insights, stories, and thoughts on technology, design, and education.
                </p>
            </div>
          </div>
        </motion.header>

        <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post) => (
            <motion.div key={post.slug} variants={itemVariants}>
              <Card className="bg-muted/30 group overflow-hidden h-full flex flex-col backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden">
                    <Link href={`/blog/${post.slug}`}>
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          width={600}
                          height={400}
                          data-ai-hint="blog post cover"
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                  <CardTitle className="text-xl font-bold mb-2 text-primary-foreground group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex flex-col items-start gap-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                             <Avatar className="h-6 w-6">
                                <AvatarImage src={post.author.imageUrl} alt={post.author.name} />
                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4" />
                           <time dateTime={new Date(post.date).toISOString()}>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                        </div>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
