
'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Lock, Star, FileText, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LibraryItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { getLibraryItems } from '../actions';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  const isSubscribed = false; // Placeholder

  const renderContent = () => {
    if (item.isPremium && !isSubscribed) {
      return (
        <Card className="bg-muted/30 border-primary/20 text-center p-8 backdrop-blur-sm mt-8">
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
      );
    }

    const hasPdf = !!item.pdfUrl;
    const hasText = !!item.content;

    return (
        <Tabs defaultValue={hasPdf ? "document" : "text"} className="w-full mt-8">
            <div className="flex justify-center">
              <TabsList>
                  {hasPdf && <TabsTrigger value="document"><FileText className="mr-2 h-4 w-4"/>Document</TabsTrigger>}
                  {hasText && <TabsTrigger value="text"><BookText className="mr-2 h-4 w-4"/>Text Version</TabsTrigger>}
              </TabsList>
            </div>
            {hasPdf && (
              <TabsContent value="document">
                  <div className="bg-muted/20 p-2 sm:p-4 rounded-lg shadow-inner mt-4">
                    <div className="aspect-[4/5] w-full">
                       <embed src={item.pdfUrl} type="application/pdf" className="w-full h-full" />
                    </div>
                  </div>
              </TabsContent>
            )}
            {hasText && (
               <TabsContent value="text">
                  <div className="bg-muted/20 p-4 sm:p-8 rounded-lg shadow-inner mt-4">
                      <div className="prose prose-invert prose-lg max-w-none mx-auto leading-relaxed whitespace-pre-line text-foreground/90 font-serif">
                          {item.content}
                      </div>
                  </div>
              </TabsContent>
            )}
            {!hasPdf && !hasText && (
                <div className="text-center text-muted-foreground py-16">
                    Content not available for this item.
                </div>
            )}
        </Tabs>
    )
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center text-center gap-4"
        >
            <div className="flex-shrink-0">
                <Image
                    src={item.coverImage}
                    alt={item.title}
                    width={150}
                    height={200}
                    className="rounded-lg shadow-2xl object-cover"
                    data-ai-hint={item.imageAiHint}
                />
            </div>
            <div className="md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary-foreground">
                  {item.title}
                </h1>
                <p className="text-xl text-muted-foreground mt-1">{item.author}</p>
                 <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    <Badge variant="secondary">{item.category}</Badge>
                    {item.isPremium && <Badge variant="destructive" className="gap-1"><Star className="h-3 w-3" /> Premium</Badge>}
                </div>
            </div>
        </motion.div>
        
        <main>
            {renderContent()}
        </main>
      </div>
    </div>
  );
}
