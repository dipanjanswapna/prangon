
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projects } from '@/lib/projects';

const allCategories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
const allTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))];

export default function ProfessionalProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  const filteredProjects = projects.filter(project => {
    const categoryMatch = selectedCategory === 'All' || project.category === selectedCategory;
    const tagMatch = selectedTag === 'All' || project.tags.includes(selectedTag);
    return categoryMatch && tagMatch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } },
    exit: { y: -20, opacity: 0, scale: 0.95 }
  };

  const FilterControls = ({ title, options, selected, setSelected }: { title: string, options: string[], selected: string, setSelected: (value: string) => void }) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-primary-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <Button
            key={option}
            variant={selected === option ? 'default' : 'secondary'}
            onClick={() => setSelected(option)}
            className="rounded-full"
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative bg-background min-h-screen">
      <Image
        src="https://cdna.artstation.com/p/assets/images/images/047/764/192/large/srabon-arafat-uploded-file.jpg?1648398231"
        alt="Work background"
        fill
        className="absolute inset-0 z-0 object-cover opacity-10"
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
            A showcase of my skills through real-world client projects. Filter by category or technology to explore my work.
          </p>
        </motion.header>

        <Card className="bg-muted/30 backdrop-blur-sm p-6 rounded-2xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FilterControls title="Filter by Category" options={allCategories} selected={selectedCategory} setSelected={setSelectedCategory} />
            <FilterControls title="Filter by Technology/Tool" options={allTags} selected={selectedTag} setSelected={setSelectedTag} />
          </div>
        </Card>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout
              >
                <Card className="bg-muted/30 group overflow-hidden h-full flex flex-col backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-2xl">
                   <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-2xl">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          width={600}
                          height={400}
                          data-ai-hint={project.imageAiHint}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </CardHeader>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <Badge variant="outline" className="mb-2 self-start">{project.category}</Badge>
                    <CardTitle className="text-xl font-bold mb-2 text-primary-foreground group-hover:text-primary transition-colors">
                        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mb-4 flex-grow">{project.description}</CardDescription>
                     <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </div>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Link href={`/projects/${project.slug}`}>
                      <Button variant="outline" className="w-full">
                        View Case Study <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
