'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Search, X, Maximize, Heart, MessageCircle, Share2, Download, Palette, PencilRuler, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { VisualArt } from '@/lib/types';
import { getVisualArts } from '../admin/visual-arts/actions';
import { Skeleton } from '@/components/ui/skeleton';

const MasonryGrid = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4", className)}>
      {children}
    </div>
  );
};

const ArtCard = ({ art, onClick }: { art: VisualArt; onClick: () => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="mb-4 break-inside-avoid group cursor-pointer"
      onClick={onClick}
    >
      <Card className="relative overflow-hidden rounded-2xl border-white/20 border bg-white/5 backdrop-blur-lg transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:shadow-2xl hover:border-primary/50">
        <Image
          src={art.imageUrl}
          alt={art.title}
          width={500}
          height={500}
          data-ai-hint={art.imageAiHint}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="font-bold text-white text-lg truncate">{art.title}</h3>
          <Badge variant="secondary" className="mt-1">{art.category}</Badge>
        </div>
      </Card>
    </motion.div>
  );
};

export default function VisualArtsPage() {
  const [artworks, setArtworks] = useState<VisualArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredArtworks, setFilteredArtworks] = useState<VisualArt[]>([]);
  const [selectedArt, setSelectedArt] = useState<VisualArt | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getVisualArts()
      .then(data => {
        setArtworks(data);
        setFilteredArtworks(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = artworks;

    if (activeCategory !== 'All') {
      result = result.filter(art => art.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(art =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredArtworks(result);
  }, [activeCategory, searchQuery, artworks]);
  
  const categories = ['All', 'Handmade Art', 'Illustration', 'Photography', 'Graphics Design', 'UI/UX Design'];

  const getCategoryIcon = (category: string) => {
      switch(category) {
          case 'Handmade Art': return <PencilRuler className="h-4 w-4 mr-2" />;
          case 'Illustration': return <Palette className="h-4 w-4 mr-2" />;
          case 'Photography': return <Camera className="h-4 w-4 mr-2" />;
          default: return null;
      }
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
        <Image
            src="https://www.shutterstock.com/image-vector/colorful-illustration-glowing-astronaut-made-600nw-2238305553.jpg"
            alt="Visual Arts background"
            layout="fill"
            objectFit="cover"
            className="fixed inset-0 z-0 opacity-25"
            data-ai-hint="glowing astronaut"
        />
      
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-white/10 p-4 rounded-full mb-4">
            <Palette className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-white uppercase">
            Visual Arts Gallery
          </h1>
          <p className="text-lg md:text-xl text-white/70 mt-4 max-w-3xl mx-auto">
            A curated collection of my creative works, from handmade sketches to digital masterpieces.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="sticky top-20 z-20 mb-8 p-4 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <Input
                type="text"
                placeholder="Search by title or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border-white/20 rounded-lg pl-10 text-white placeholder:text-white/50 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap rounded-full transition-all duration-300 ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'}`}
                >
                  {getCategoryIcon(cat)}
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {loading ? (
             <MasonryGrid>
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 w-full mb-4 rounded-2xl" />)}
             </MasonryGrid>
        ) : (
            <AnimatePresence>
                <MasonryGrid>
                    {filteredArtworks.map(art => (
                        <ArtCard key={art.id} art={art} onClick={() => setSelectedArt(art)} />
                    ))}
                </MasonryGrid>
            </AnimatePresence>
        )}

        <Dialog open={!!selectedArt} onOpenChange={(isOpen) => !isOpen && setSelectedArt(null)}>
          <DialogContent className="max-w-4xl w-full bg-gray-900/50 backdrop-blur-2xl border-primary/50 text-white rounded-2xl p-0">
             {selectedArt && (
                 <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 relative">
                         <Image
                            src={selectedArt.imageUrl}
                            alt={selectedArt.title}
                            width={800}
                            height={800}
                            data-ai-hint={selectedArt.imageAiHint}
                            className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none"
                         />
                         <div className="absolute top-2 right-2 flex gap-2">
                             <Button size="icon" variant="ghost" className="bg-black/50 hover:bg-black/70 rounded-full text-white"><Maximize /></Button>
                             <DialogClose asChild>
                                 <Button size="icon" variant="ghost" className="bg-black/50 hover:bg-black/70 rounded-full text-white"><X /></Button>
                            </DialogClose>
                         </div>
                    </div>
                    <div className="md:w-1/2 p-6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold font-headline text-primary">{selectedArt.title}</DialogTitle>
                            <DialogDescription className="text-white/70">{selectedArt.date}</DialogDescription>
                        </DialogHeader>
                        <div className="my-4 text-white/90 flex-grow">
                           <p>{selectedArt.description}</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Tools Used:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedArt.tools.map(tool => <Badge key={tool} variant="secondary">{tool}</Badge>)}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Tags:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedArt.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                            <div className="flex gap-4">
                               <Button variant="ghost" className="text-white/70 hover:text-white"><Heart className="mr-2 h-4 w-4" /> {selectedArt.likes}</Button>
                               <Button variant="ghost" className="text-white/70 hover:text-white"><MessageCircle className="mr-2 h-4 w-4" /> {selectedArt.comments.length}</Button>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </div>
                 </div>
             )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
