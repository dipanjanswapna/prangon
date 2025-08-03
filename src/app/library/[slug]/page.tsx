
'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Lock, Tag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LibraryItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { getLibraryItems } from '../actions';
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LibraryItemPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [item, setItem] = useState<LibraryItem | null | undefined>(undefined);

  useEffect(() => {
    async function fetchItem() {
      const items = await getLibraryItems();
      const foundItem = items.find(p => p.slug === slug);
      setItem(foundItem);
    }
    fetchItem();
  }, [slug]);

  if (item === undefined) {
    // Loading state
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!item) {
    notFound();
  }

  // This is a placeholder for checking user subscription
  const isSubscribed = false; 

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          <aside className="lg:w-1/3 lg:sticky lg:top-24 self-start">
             <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <Card className="overflow-hidden bg-muted/30">
                    <CardContent className="p-0">
                         <div className="relative w-full aspect-[3/4]">
                             <Image
                                src={item.coverImage}
                                alt={item.title}
                                layout="fill"
                                objectFit="cover"
                                data-ai-hint={item.imageAiHint}
                            />
                         </div>
                         <div className="p-6">
                            <h1 className="text-2xl font-bold font-headline text-primary-foreground mb-2">
                              {item.title}
                            </h1>
                            <p className="text-lg text-muted-foreground mb-4">{item.author}</p>
                             <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{item.category}</Badge>
                                {item.isPremium && <Badge variant="destructive" className="gap-1"><Star className="h-3 w-3" /> Premium</Badge>}
                            </div>
                         </div>
                    </CardContent>
                </Card>
            </motion.div>
          </aside>

          <main className="lg:w-2/3">
             <article>
                {item.isPremium && !isSubscribed ? (
                 <Card className="bg-muted/30 border-primary/20 text-center p-8 backdrop-blur-sm">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 text-primary w-fit p-3 rounded-full mb-4">
                            <Lock className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-primary-foreground">This Content is for Subscribers Only</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            To read this {item.category.toLowerCase()}, please subscribe to our premium plan. Unlock all premium content and support our work.
                        </p>
                        <Link href="/subscribe">
                            <Button size="lg">Subscribe Now</Button>
                        </Link>
                    </CardContent>
                </Card>
              ) : (
                <div className="bg-muted/20 p-4 sm:p-8 rounded-lg shadow-inner">
                    <div className="prose prose-invert prose-lg max-w-none mx-auto leading-relaxed whitespace-pre-line text-foreground/90 font-serif">
                        {item.content || "Content not available for this item."}
                    </div>
                </div>
              )}
             </article>
          </main>
        </div>
      </div>
    </div>
  );
}
