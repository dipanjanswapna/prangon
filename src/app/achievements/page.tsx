
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, GraduationCap, Users, ExternalLink, Certificate } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { achievements, Achievement } from '@/lib/achievements';
import { cn } from '@/lib/utils';

const categoryFilters = ['All', ...Array.from(new Set(achievements.map(e => e.category)))];

const categoryStyles = {
    Award: { icon: Trophy, color: 'text-yellow-500' },
    Certification: { icon: Certificate, color: 'text-green-500' },
    Academic: { icon: GraduationCap, color: 'text-blue-500' },
    Leadership: { icon: Users, color: 'text-purple-500' },
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const CategoryIcon = categoryStyles[achievement.category]?.icon || Award;
    const categoryColor = categoryStyles[achievement.category]?.color || 'text-primary';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        >
            <Card className="bg-muted/30 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full flex flex-col">
                <CardHeader>
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
                    <p className="text-muted-foreground mb-4">{achievement.description}</p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto flex justify-between items-center">
                    <Badge variant="secondary">{achievement.category}</Badge>
                    <p className="text-sm font-medium text-muted-foreground">{achievement.date}</p>
                </div>
                 {achievement.link && (
                    <div className="p-6 pt-0">
                       <Link href={achievement.link} target="_blank" rel="noopener noreferrer">
                           <Button variant="outline" size="sm" className="w-full">
                               <ExternalLink className="mr-2 h-4 w-4" />
                               Verify Certificate
                           </Button>
                       </Link>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

export default function AchievementsPage() {
    const [activeFilter, setActiveFilter] = useState('All');

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
                            <AchievementCard key={ach.id} achievement={ach} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
