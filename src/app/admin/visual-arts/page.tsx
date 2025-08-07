'use client';

import { getVisualArts } from './actions';
import { VisualArtForm, DeleteArtButton } from '@/components/admin/visual-arts-form';
import { VisualArt } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ArtCardSkeleton = () => (
    <Card>
        <Skeleton className="h-48 w-full" />
        <CardContent className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-20" />
            <div className="flex justify-end gap-2 pt-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
            </div>
        </CardContent>
    </Card>
);

export default function AdminVisualArtsPage() {
  const [artworks, setArtworks] = useState<VisualArt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVisualArts()
        .then(setArtworks)
        .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manage Visual Arts</h2>
                <p className="text-muted-foreground">
                Add, edit, or delete your creative artworks.
                </p>
            </div>
            <VisualArtForm />
        </div>

        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            {loading ? (
                [...Array(4)].map((_, i) => <ArtCardSkeleton key={i} />)
            ) : artworks.length > 0 ? (
                artworks.map(art => (
                    <motion.div key={art.id} variants={itemVariants}>
                        <Card className="group">
                            <CardHeader className="p-0">
                                <Image
                                    src={art.imageUrl}
                                    alt={art.title}
                                    width={400}
                                    height={400}
                                    className="rounded-t-lg object-cover aspect-square"
                                    data-ai-hint={art.imageAiHint}
                                />
                            </CardHeader>
                            <CardContent className="p-4 space-y-2">
                                <CardTitle className="text-lg truncate">{art.title}</CardTitle>
                                <CardDescription>
                                    <Badge variant="secondary">{art.category}</Badge>
                                </CardDescription>
                                <div className="flex justify-end gap-2 pt-2">
                                    <VisualArtForm artToEdit={art} />
                                    <DeleteArtButton id={art.id} />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))
            ) : (
                <div className="col-span-full text-center py-16">
                    <p className="text-muted-foreground">No artworks found. Add your first piece!</p>
                </div>
            )}
        </motion.div>
      </div>
    </div>
  );
}
