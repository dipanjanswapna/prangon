
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { LibraryItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Crown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { getLibraryItems } from './actions';


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

function ItemCard({ item }: { item: LibraryItem }) {
    return (
        <motion.div variants={itemVariants} className="h-full">
            <Link href={`/library/${item.slug}`} className="block h-full">
                <Card className="h-full group relative overflow-hidden rounded-lg shadow-lg bg-muted/30 hover:shadow-primary/20 transition-all duration-300 flex flex-col">
                    <div className="relative h-64 w-full">
                        <Image 
                            src={item.coverImage}
                            alt={item.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-500 group-hover:scale-105"
                            data-ai-hint={item.imageAiHint}
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                         {item.isPremium && (
                            <Badge variant="destructive" className="absolute top-2 left-2">Premium</Badge>
                         )}
                    </div>
                    <CardContent className="p-4 flex-grow flex flex-col justify-between">
                       <div>
                         <h3 className="font-bold text-lg text-primary-foreground line-clamp-2">{item.title}</h3>
                         <p className="text-sm text-muted-foreground">{item.author}</p>
                       </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

function Section({ title, items }: { title: string, items: LibraryItem[] }) {
    if (items.length === 0) return null;
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
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {items.map(item => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </div>
        </motion.section>
    );
}

export default function LibraryPage() {
    const [items, setItems] = useState<LibraryItem[]>([]);
     const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    useEffect(() => {
        getLibraryItems().then(setItems);
    }, []);

    const featuredItems = useMemo(() => items.filter(i => i.isFeatured), [items]);
    const books = useMemo(() => items.filter(i => i.category === 'Book'), [items]);
    const weeklyMagazines = useMemo(() => items.filter(i => i.category === 'Weekly Magazine'), [items]);
    const monthlyMagazines = useMemo(() => items.filter(i => i.category === 'Monthly Magazine'), [items]);
    const comicBooks = useMemo(() => items.filter(i => i.category === 'Comic Book'), [items]);

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
                <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-primary-foreground uppercase">
                Digital Library
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                Explore a collection of books and magazines. Premium content available for subscribers.
            </p>
        </motion.header>
        
        {featuredItems.length > 0 && (
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-24"
            >
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent>
                        {featuredItems.map(item => (
                            <CarouselItem key={item.id}>
                                 <Link href={`/library/${item.slug}`} className="block group">
                                    <div className="relative overflow-hidden rounded-lg h-96">
                                        <Image
                                            src={item.coverImage}
                                            alt={item.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="transition-transform duration-500 group-hover:scale-110"
                                            data-ai-hint={item.imageAiHint}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-8 text-white">
                                            <Badge className="mb-2 bg-yellow-500 text-black gap-1">
                                                <Crown className="h-3 w-3" />
                                                Featured
                                            </Badge>
                                            <h2 className="text-3xl font-bold line-clamp-2">{item.title}</h2>
                                            <p>{item.author}</p>
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

        <Section title="Books" items={books} />
        <Section title="Comic Books" items={comicBooks} />
        <Section title="Weekly Magazines" items={weeklyMagazines} />
        <Section title="Monthly Magazines" items={monthlyMagazines} />
        
        {items.length === 0 && (
             <div className="text-center text-muted-foreground py-16">
                <p>No items found in the library. Please check back later.</p>
            </div>
        )}
        
      </div>
    </div>
  );
}
