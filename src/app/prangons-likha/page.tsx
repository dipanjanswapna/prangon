
'use client';

import { useState, useMemo } from 'react';
import { getPrangonsLikhaPosts } from '@/app/admin/prangons-likha/actions';
import { PrangonsLikhaPost } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowRight, Feather, Crown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from '@/components/ui/badge';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

function PostCard({ post }: { post: PrangonsLikhaPost }) {
    return (
        <motion.div variants={itemVariants} className="h-full">
            <Link href={`/prangons-likha/${post.slug}`} className="block h-full">
                <Card className="h-full group relative overflow-hidden rounded-lg shadow-lg bg-muted/30 hover:shadow-primary/20 transition-all duration-300 flex flex-col">
                    <div className="relative h-48 w-full">
                        <Image 
                            src={post.coverImage}
                            alt={post.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-500 group-hover:scale-105"
                            data-ai-hint={post.imageAiHint}
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                         {post.isPremium && (
                            <div className="absolute top-2 left-2">
                                <Badge className="bg-yellow-500 text-black gap-1">
                                    <Crown className="h-3 w-3" />
                                    Premium
                                </Badge>
                            </div>
                        )}
                    </div>
                    <CardContent className="p-4 flex-grow flex flex-col justify-between">
                       <div>
                         <h3 className="font-bold text-lg text-primary-foreground line-clamp-2">{post.title}</h3>
                         <p className="text-sm text-muted-foreground">{post.author}</p>
                       </div>
                       <div className="mt-2">
                         <Badge variant="outline">{post.category}</Badge>
                       </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

function Section({ title, posts, href }: { title: string, posts: PrangonsLikhaPost[], href: string }) {
    if (posts.length === 0) return null;
    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold font-headline text-primary-foreground">{title}</h2>
                <Link href={href}>
                    <Button variant="ghost" className="text-primary">
                        See All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </motion.section>
    );
}

export default function PrangonsLikhaPage() {
    const [posts, setPosts] = useState<PrangonsLikhaPost[]>([]);

    useState(() => {
        getPrangonsLikhaPosts().then(setPosts);
    });

    const categorizedPosts = useMemo(() => {
        return posts.reduce((acc, post) => {
            if (!acc[post.category]) {
                acc[post.category] = [];
            }
            acc[post.category].push(post);
            return acc;
        }, {} as Record<string, PrangonsLikhaPost[]>);
    }, [posts]);
    
    const featuredPosts = useMemo(() => posts.filter(p => p.isPremium).slice(0, 5), [posts]);

  return (
    <div className="bg-background min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative text-center mb-16 rounded-lg"
        >
            <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                <Feather className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-primary-foreground uppercase">
                Prangons Likha
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                A curated collection of stories, poems, and articles. Dive into the world of words.
            </p>
        </motion.header>
        
        {featuredPosts.length > 0 && (
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-16"
            >
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {featuredPosts.map(post => (
                            <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                                 <Link href={`/prangons-likha/${post.slug}`} className="block group">
                                    <div className="relative overflow-hidden rounded-lg h-80">
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition-transform duration-500 group-hover:scale-110"
                                            data-ai-hint={post.imageAiHint}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-6 text-white">
                                            <Badge className="mb-2 bg-yellow-500 text-black">Featured</Badge>
                                            <h2 className="text-2xl font-bold line-clamp-2">{post.title}</h2>
                                            <p>{post.author}</p>
                                        </div>
                                    </div>
                                 </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4"/>
                    <CarouselNext className="right-4"/>
                </Carousel>
            </motion.section>
        )}
        
        {Object.entries(categorizedPosts).map(([category, posts]) => (
            <Section key={category} title={category} posts={posts} href={`/prangons-likha/category/${category}`} />
        ))}
        
        {posts.length === 0 && (
             <div className="text-center text-muted-foreground py-16">
                <p>No literary works found. Please check back later.</p>
            </div>
        )}
        
      </div>
    </div>
  );
}
