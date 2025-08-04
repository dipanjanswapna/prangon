
'use client';

import { motion } from 'framer-motion';
import { Rss, Calendar, User, ArrowRight, Star, Crown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { BlogPost } from '@/lib/types';
import { getBlogPosts } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

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

const PostCardSkeleton = () => (
    <Card className="flex flex-col h-full bg-muted/30 backdrop-blur-sm">
        <Skeleton className="h-48 w-full" />
        <CardHeader>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-full" />
        </CardHeader>
        <CardContent className="flex-grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
        </CardContent>
        <CardFooter>
            <div className="flex items-center gap-2 w-full">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-grow">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24 mt-1" />
                </div>
            </div>
        </CardFooter>
    </Card>
);

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const featuredPost = posts.find(p => p.isFeatured) || posts[0];
  const otherPosts = posts.filter(p => p.id !== featuredPost?.id);

  return (
    <div className="bg-background min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative text-center mb-16 rounded-lg"
        >
          <div className="py-16 md:py-24">
            <div className="absolute inset-0 z-0">
                 <Image
                    src="https://wallpapercat.com/w/full/d/d/f/46447-3840x2160-desktop-4k-squid-game-wallpaper.jpg"
                    alt="Blog background"
                    fill
                    className="object-cover opacity-10"
                    data-ai-hint="abstract technology background"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>
            <div className="relative z-10">
                <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
                   <Rss className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-headline tracking-tighter text-primary-foreground uppercase">
                  The Blog
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-4xl mx-auto">
                  Insights, stories, and thoughts on technology, design, and education.
                </p>
            </div>
          </div>
        </motion.header>
        
        {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2"><Skeleton className="h-[500px] w-full"/></div>
                <div className="space-y-8">
                    <PostCardSkeleton />
                    <PostCardSkeleton />
                </div>
            </div>
        ) : posts.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {featuredPost && (
                 <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Link href={`/blog/${featuredPost.slug}`}>
                        <Card className="bg-muted/30 group overflow-hidden shadow-xl hover:shadow-primary/20 transition-all duration-300">
                             <div className="relative h-96">
                                <Image
                                    src={featuredPost.coverImage}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    data-ai-hint={featuredPost.imageAiHint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6">
                                    <Badge className="mb-2 gap-1 bg-yellow-400 text-black"><Crown className="h-3 w-3" /> Featured</Badge>
                                    <CardTitle className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{featuredPost.title}</CardTitle>
                                    <CardDescription className="text-white/80 mt-2">{featuredPost.category}</CardDescription>
                                </div>
                             </div>
                        </Card>
                    </Link>
                </motion.div>
            )}
           
            <div className="grid grid-cols-1 gap-8">
              {otherPosts.slice(0, 2).map((post) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="bg-muted/30 h-full flex flex-col group hover:shadow-primary/20 transition-all duration-300">
                      <CardHeader>
                        {post.isPremium && <Badge variant="destructive" className="w-fit mb-2 gap-1"><Star className="h-3 w-3"/>Premium</Badge>}
                        <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                          <p className="text-muted-foreground line-clamp-3">
                             {post.content.substring(0, 120)}...
                          </p>
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                           <Avatar className="h-8 w-8">
                                <AvatarImage src="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg" alt={post.author} />
                                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <span className="font-semibold text-foreground">{post.author}</span>
                                <p>{new Date(post.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-muted-foreground py-16">
            <p>No blog posts available at the moment. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
