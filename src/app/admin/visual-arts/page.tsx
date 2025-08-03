
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Construction } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminVisualArtsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Manage Visual Arts</h2>
            </div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center h-[60vh]"
            >
                <Card className="w-full max-w-lg text-center bg-muted/30">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 text-primary w-fit p-4 rounded-full mb-4">
                            <Construction className="h-12 w-12" />
                        </div>
                        <CardTitle className="text-2xl font-bold font-headline text-primary-foreground">Feature Coming Soon!</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            The ability to add, edit, and delete visual arts from the admin panel is currently under construction.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            For now, you can view the existing gallery which is populated from a static data file. We are working hard to bring this dynamic feature to you soon.
                        </p>
                        <Link href="/visual-arts">
                            <Button variant="outline">
                                <Palette className="mr-2 h-4 w-4" />
                                View Current Gallery
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
