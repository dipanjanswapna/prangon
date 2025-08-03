
'use client';

import { motion } from 'framer-motion';
import { Rss, Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <div className="bg-background min-h-screen py-16 md:py-24">
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
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black font-headline tracking-tighter text-primary uppercase">
                  The Blog
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-4xl mx-auto">
                  Insights, stories, and thoughts on technology, design, and education.
                </p>
            </div>
          </div>
        </motion.header>
        
        <div className="text-center text-muted-foreground">
            No blog posts available at the moment.
        </div>

      </div>
    </div>
  );
}
