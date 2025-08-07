
'use client';

import { useState, useMemo, useEffect } from 'react';
import { getPrangonsLikhaPosts } from '@/app/admin/prangons-likha/actions';
import { PrangonsLikhaPost } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowRight, Feather, Crown, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'next/navigation';

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
            <Link href={`/prangons-likha/post/${post.slug}`} className="block h-full">
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
                         <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {post.isFeatured && (
                                <Badge className="bg-yellow-500 text-black gap-1 w-fit">
                                    <Crown className="h-3 w-3" />
                                    Featured
                                </Badge>
                            )}
                            {post.isPremium && (
                                <Badge variant="destructive" className="gap-1 w-fit">
                                    <Star className="h-3 w-3" />
                                    Premium
                                </Badge>
                            )}
                        </div>
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

export default function PrangonsLikhaCategoryPage() {
    const params = useParams();
    const category = decodeURIComponent(params.category as string);
    const [posts, setPosts] = useState<PrangonsLikhaPost[]>([]);

    useEffect(() => {
        getPrangonsLikhaPosts().then(allPosts => {
            const filteredPosts = allPosts.filter(p => p.category === category);
            setPosts(filteredPosts);
        });
    }, [category]);
    
  return (
    <div className="bg-background min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative text-center mb-16 rounded-lg"
        >
            <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-primary-foreground uppercase">
                {category}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                A collection of writings from the "{category}" category.
            </p>
        </motion.header>
        
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
        >
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </motion.div>

        {posts.length === 0 && (
             <div className="text-center text-muted-foreground py-16">
                <p>No literary works found in this category.</p>
            </div>
        )}
        
      </div>
    </div>
  );
}
