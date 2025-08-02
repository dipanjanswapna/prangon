
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, GraduationCap, Users, ExternalLink, Verified, Download, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { achievements, Achievement } from '@/lib/achievements';
import { cn } from '@/lib/utils';

const categoryFilters = ['All', ...Array.from(new Set(achievements.map(e => e.category)))];

const categoryStyles = {
    Award: { icon: Trophy, color: 'text-yellow-500' },
    Certification: { icon: Verified, color: 'text-green-500' },
    Academic: { icon: GraduationCap, color: 'text-blue-500' },
    Leadership: { icon: Users, color: 'text-purple-500' },
};

const AchievementCard = ({ achievement, onCardClick }: { achievement: Achievement, onCardClick: (achievement: Achievement) => void }) => {
    const CategoryIcon = categoryStyles[achievement.category]?.icon || Award;
    const categoryColor = categoryStyles[achievement.category]?.color || 'text-primary';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            onClick={() => onCardClick(achievement)}
            className="cursor-pointer"
        >
            <Card className="bg-muted/30 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full flex flex-col group">
                {achievement.imageUrl && (
                    <div className="relative overflow-hidden rounded-t-lg h-48">
                         <Image
                            src={achievement.imageUrl}
                            alt={achievement.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-500 group-hover:scale-105"
                            data-ai-hint={achievement.imageAiHint}
                        />
                    </div>
                )}
                <CardHeader className={cn(!achievement.imageUrl && "pt-6")}>
                    <div className="flex items-start gap-4">
                       <div className={cn("flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10", categoryColor)}>
                            <CategoryIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                             <CardTitle className="text-xl font-bold text-primary-foreground">{achievement.title}</CardTitle>
                             <CardDescription className="font-semibold">{achievement.issuer}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground mb-4 line-clamp-3">{achievement.description}</p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto flex justify-between items-center">
                    <Badge variant="secondary">{achievement.category}</Badge>
                    <p className="text-sm font-medium text-muted-foreground">{achievement.date}</p>
                </div>
            </Card>
        </motion.div>
    );
};

export default function AchievementsPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    const filteredAchievements = activeFilter === 'All'
        ? achievements
        : achievements.filter(e => e.category === activeFilter);
        
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    return (
        <>
            <div className="relative bg-background min-h-screen">
                <Image
                    src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/b795e6123985579.6100155b16148.jpg"
                    alt="Achievements Background"
                    fill
                    className="absolute inset-0 z-0 object-cover opacity-10"
                    data-ai-hint="abstract geometric background"
                />
                <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
                    <motion.header
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                            <Trophy className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-primary-foreground uppercase">
                            My Achievements
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                            A collection of my awards, certifications, and other notable recognitions throughout my journey.
                        </p>
                    </motion.header>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex justify-center flex-wrap gap-2 mb-12"
                    >
                        {categoryFilters.map(filter => (
                            <Button
                                key={filter}
                                variant={activeFilter === filter ? 'default' : 'outline'}
                                onClick={() => setActiveFilter(filter)}
                                className="rounded-full"
                            >
                                {filter}
                            </Button>
                        ))}
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                        {filteredAchievements.map((ach) => (
                                <AchievementCard key={ach.id} achievement={ach} onCardClick={setSelectedAchievement} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
            
            <Dialog open={!!selectedAchievement} onOpenChange={(isOpen) => !isOpen && setSelectedAchievement(null)}>
              <DialogContent className="max-w-3xl w-full bg-muted/50 backdrop-blur-2xl border-primary/50 text-white rounded-2xl p-0">
                 {selectedAchievement && (
                     <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 relative">
                             <Image
                                src={selectedAchievement.imageUrl || "https://placehold.co/800x800.png"}
                                alt={selectedAchievement.title}
                                width={800}
                                height={800}
                                data-ai-hint={selectedAchievement.imageAiHint}
                                className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none"
                             />
                             <DialogClose asChild>
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full text-white"><X /></Button>
                            </DialogClose>
                        </div>
                        <div className="md:w-1/2 p-6 flex flex-col">
                            <DialogHeader>
                                <Badge variant="secondary" className="self-start mb-2">{selectedAchievement.category}</Badge>
                                <DialogTitle className="text-2xl font-bold font-headline text-primary">{selectedAchievement.title}</DialogTitle>
                                <DialogDescription className="text-white/70">{selectedAchievement.issuer} - {selectedAchievement.date}</DialogDescription>
                            </DialogHeader>
                            <div className="my-4 text-white/90 flex-grow">
                               <p>{selectedAchievement.description}</p>
                            </div>

                            {selectedAchievement.link && (
                                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                                   <Link href={selectedAchievement.link} target="_blank" rel="noopener noreferrer" className="w-full">
                                       <Button variant="outline" className="w-full">
                                           <ExternalLink className="mr-2 h-4 w-4" />
                                           Verify
                                       </Button>
                                   </Link>
                                    <a href={selectedAchievement.link} download target="_blank" rel="noopener noreferrer" className="w-full">
                                       <Button className="w-full">
                                           <Download className="mr-2 h-4 w-4" />
                                           Download Certificate
                                       </Button>
                                   </a>
                                </div>
                            )}
                        </div>
                     </div>
                 )}
              </DialogContent>
            </Dialog>

        </>
    );
}
