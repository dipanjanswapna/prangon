
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ArrowRight, Code, BarChart3, Palette, Heart, ExternalLink, Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getProjects } from '@/app/admin/projects/actions';
import { Project } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const ProjectCardSkeleton = () => (
  <Card className="bg-muted/30 backdrop-blur-sm shadow-lg h-full flex flex-col">
    <Skeleton className="h-48 w-full rounded-t-lg" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/4 mt-2" />
    </CardHeader>
    <CardContent className="flex-grow">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mt-2" />
      <div className="flex flex-wrap gap-2 mt-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

export default function ProfessionalProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    getProjects()
      .then(data => {
        setProjects(data);
        setFilteredProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const allCategories = projects.map(p => p.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [projects]);

  useEffect(() => {
    if (categoryFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === categoryFilter));
    }
  }, [categoryFilter, projects]);

  return (
    <div className="relative bg-background min-h-screen">
      <Image
        src="https://cdna.artstation.com/p/assets/images/images/047/764/192/large/srabon-arafat-uploded-file.jpg?1648398231"
        alt="Work background"
        fill
        className="absolute inset-0 z-0 object-cover opacity-25"
        data-ai-hint="abstract background"
      />
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-primary-foreground uppercase">
            Professional Projects
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
            A showcase of my skills through real-world client projects. Filter by category to explore my work.
          </p>
        </motion.header>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center mb-12"
        >
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-full border">
                <Filter className="h-5 w-5 text-primary ml-2" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px] bg-transparent border-0 focus:ring-0">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-muted-foreground py-16"
          >
            No projects found for the selected category.
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map(project => (
                <motion.div key={project.id} variants={itemVariants} layout>
                  <Card className="bg-muted/30 backdrop-blur-sm shadow-lg h-full flex flex-col group overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:border-primary/20">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={project.imageAiHint}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold text-primary-foreground group-hover:text-primary transition-colors">{project.title}</CardTitle>
                        {project.link && (
                          <Link href={project.link} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-5 w-5 text-muted-foreground" />
                            </Button>
                          </Link>
                        )}
                      </div>
                      <CardDescription className="font-semibold text-primary">{project.client}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
