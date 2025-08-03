
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Lock, Tag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LibraryItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { getLibraryItems } from '../actions';


export async function generateStaticParams() {
  const items = await getLibraryItems();
  return items.map(item => ({
    slug: item.slug,
  }));
}

export default async function LibraryItemPage({ params }: { params: { slug: string } }) {
  const items = await getLibraryItems();
  const item = items.find(p => p.slug === params.slug);

  if (!item) {
    notFound();
  }

  // This is a placeholder for checking user subscription
  const isSubscribed = false; 

  return (
    <div className="relative bg-background min-h-screen">
        <div 
            className="absolute inset-x-0 top-0 h-[50vh] bg-cover bg-center"
            style={{backgroundImage: `url(${item.coverImage})`}}
        >
             <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"/>
        </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <article className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative w-48 h-64 md:w-56 md:h-80 mx-auto mb-8 shadow-2xl rounded-lg overflow-hidden"
            >
                <Image
                    src={item.coverImage}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={item.imageAiHint}
                />
            </motion.div>
            <div className="flex justify-center gap-2 mb-4">
                <Badge variant="secondary">{item.category}</Badge>
                {item.isPremium && <Badge variant="destructive" className="gap-1"><Star className="h-3 w-3" /> Premium</Badge>}
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-primary-foreground uppercase mb-4">
              {item.title}
            </h1>
            <p className="text-lg text-muted-foreground">{item.author}</p>
          </header>
          
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
                    {item.content}
                </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
