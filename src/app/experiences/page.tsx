
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Award, Users, Wand2, Calendar, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { experiences, Experience } from '@/lib/experiences';
import { cn } from '@/lib/utils';

const categoryFilters = ['All', ...Array.from(new Set(experiences.map(e => e.category)))];

const categoryStyles = {
    Professional: { icon: Briefcase, color: 'text-blue-500' },
    Freelance: { icon: Wand2, color: 'text-green-500' },
    'Content Creation': { icon: Users, color: 'text-red-500' },
    Leadership: { icon: Award, color: 'text-yellow-500' },
};

const ExperienceCard = ({ experience }: { experience: Experience }) => {
    const CategoryIcon = categoryStyles[experience.category]?.icon || Briefcase;
    const categoryColor = categoryStyles[experience.category]?.color || 'text-primary';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="flex items-start gap-4 md:gap-8"
        >
            <div className="flex flex-col items-center">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-muted", categoryColor)}>
                    <CategoryIcon className="h-6 w-6" />
                </div>
                <div className="w-px flex-grow bg-border/50" />
            </div>
            <div className="flex-1 pb-12">
                <Card className="bg-muted/30 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div>
                                <CardTitle className="text-xl font-bold text-primary-foreground">{experience.role}</CardTitle>
                                <CardDescription className="font-semibold text-primary">{experience.entity}</CardDescription>
                            </div>
                            <Badge variant="secondary" className="self-start">{experience.category}</Badge>
                        </div>
                         <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                           <Calendar className="h-4 w-4" />
                           <span>{experience.period}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                            {experience.description.map((desc, index) => (
                                <li key={index}>{desc}</li>
                            ))}
                        </ul>
                        {experience.achievements && experience.achievements.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold text-primary-foreground mb-2 flex items-center gap-2">
                                    <Award className="h-4 w-4 text-yellow-500"/>
                                    Key Achievements
                                </h4>
                                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                                    {experience.achievements.map((ach, index) => (
                                        <li key={index}>{ach}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {experience.link && (
                            <div className="mt-4">
                               <Link href={experience.link} target="_blank" rel="noopener noreferrer">
                                   <Button variant="outline" size="sm">
                                       <ExternalLink className="mr-2 h-4 w-4" />
                                       View Project
                                   </Button>
                               </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default function ExperiencesPage() {
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredExperiences = activeFilter === 'All'
        ? experiences
        : experiences.filter(e => e.category === activeFilter);
        
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
                src="https://c4.wallpaperflare.com/wallpaper/412/867/629/your-name-sky-stars-wallpaper-preview.jpg"
                alt="Experiences Background"
                fill
                className="absolute inset-0 z-0 object-cover opacity-10"
                data-ai-hint="starry sky anime"
            />
            <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
                <motion.header
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                        <Briefcase className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-primary-foreground uppercase">
                        My Experiences
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                        A chronological journey through my professional roles, projects, and contributions.
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

                <div className="relative">
                    <div className="absolute left-6 md:left-10 top-0 h-full w-px bg-border/50" />
                     <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-0"
                     >
                        <AnimatePresence>
                           {filteredExperiences.map((exp) => (
                                <ExperienceCard key={exp.id} experience={exp} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
