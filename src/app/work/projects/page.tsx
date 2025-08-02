
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ArrowRight, Code, BarChart3, Palette } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projects } from '@/lib/projects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const allCategories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
const allTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))];

const techSkills = [
  {
    category: "Web Development",
    icon: <Code className="h-6 w-6" />,
    subCategories: [
      {
        title: "Frontend",
        skills: [
          { name: "HTML5", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1.75L3.25 4.5v13.5L12 22.25l8.75-4.25V4.5M12 1.75L3.25 4.5v13.5L12 22.25l8.75-4.25V4.5zM19.5 17L12 20.25v-7H5V5.25l7-2.625v14.375z"/></svg> },
          { name: "CSS3", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1.75L3.25 4.5v13.5L12 22.25l8.75-4.25V4.5M12 1.75L3.25 4.5v13.5L12 22.25l8.75-4.25V4.5zM12 7h5l-.5 2.5h-4.5v2h4l-.5 2.5h-3.5v2H16l-1 2.5-3 .75v-2.25h5.5l.5-2.5h-5.5V7z"/></svg> },
          { name: "JavaScript", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m4.28 13.84a.81.81 0 0 1-1 .13l-2.45-1.42a.54.54 0 0 1-.29-.48V10.2a.55.55 0 0 1 .55-.55.56.56 0 0 1 .55.55v3.34l1.65.95a.81.81 0 0 1 .13 1.01m-5-1a.81.81 0 0 1-1 .13l-2.45-1.42a.55.55 0 0 1-.29-.48v-3.86a.55.55 0 0 1 .55-.55.56.56 0 0 1 .55.55v3.34l1.65.95a.81.81 0 0 1-.13 1.14"/></svg> },
          { name: "React.js", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><ellipse cx="12" cy="12" rx="11" ry="4.2"/><path d="M12 12.01V12M12 21.8C7.64 21.8 4 17.33 4 12c0-5.33 3.64-9.8 8-9.8c4.36 0 8 4.47 8 9.8c0 5.33-3.64 9.8-8 9.8Z"/></g></svg> },
          { name: "Tailwind CSS", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.001 4.5c-4.114 0-7.462 3.344-7.462 7.458c0 2.89 1.69 5.43 4.125 6.643c.187 1.48.74 2.473 1.432 3.168c.94.94 2.21 1.48 3.707 1.48c2.218 0 3.753-1.24 4.537-2.44c.48-.74.654-1.63.585-2.733c2.083-1.24 3.443-3.52 3.443-6.126c0-4.114-3.348-7.458-7.467-7.458zm-3.28 7.459c0-.46.37-.83.83-.83h4.91c.46 0 .83.37.83.83c0 .458-.37.83-.83.83h-4.91a.83.83 0 0 1-.83-.83zm6.56 2.489c0 .46-.37.83-.83.83h-4.91a.83.83 0 0 1-.83-.83c0-.46.37-.83.83-.83h4.91c.46 0 .83.37.83.83z"/></svg> },
        ]
      },
      {
        title: "Backend",
        skills: [
          { name: "Node.js", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3m-6 16c-1.11 0-2-.89-2-2s.89-2 2-2s2 .89 2 2s-.89 2-2 2"/></svg> },
          { name: "Python", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 19.5v-3.5a1 1 0 0 1 1-1h1.5v-1.5H20a1 1 0 0 1-1-1V5a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4.5v1.5H6v1a1 1 0 0 1-1 1H3.5V12H5a1 1 0 0 1 1 1v7.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5V12h1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5zm-5.5-2.5a1.5 1.5 0 0 1-1.5-1.5V12h-2v3.5a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5V5a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 16 5v6.5a1.5 1.5 0 0 1-1.5 1.5h-1z"/></svg> },
          { name: "PHP", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><ellipse cx="12" cy="12" rx="10" ry="7.5"/><path d="M12 2.5c5.523 0 10 3.358 10 7.5s-4.477 7.5-10 7.5S2 16.642 2 12S6.477 2.5 12 2.5Zm1-1v19m-2-19v19"/></g></svg> },
          { name: "Express.js", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m14 17l-3-3l3-3l-1-1l-3 3l-3-3l-1 1l3 3l-3 3l1 1l3-3l3 3z"/></svg> },
        ]
      },
      {
        title: "Database",
        skills: [
          { name: "MySQL", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 16.5A2.5 2.5 0 0 1 16.5 19H8.07l5.58 2.23c.48.19.98.29 1.5.29H15a4 4 0 0 0 4-4v-.5M15.5 8c.32 0 .63.04.93.12l1.64.45l-.78 2.87l-1.64-.45A4.01 4.01 0 0 0 12 14h-1.45l-2.6-4.5l3.29-1.27A3.99 3.99 0 0 0 15.5 8m0-2A6.01 6.01 0 0 1 19.33 8.5l.84-3.07l-3.07.84A5.98 5.98 0 0 1 15.5 6m-7.44 2.14L3.7 6.07l.84 3.07l4.35 1.18m-2.19 2.53L4.2 14.8l3.07.84l2.5-4.42"/></svg> },
          { name: "PostgreSQL", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2M9.5 16.5v-3H7.83v-2H9.5v-2H11v6.5zm6.5 0h-2V15h2zm0-3h-2V12h2zm0-3h-2V9h2zm0-3h-2V6h2z"/></svg> },
          { name: "MongoDB", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.18 10.3c-.3-.2-.6-.3-.89-.3h-.54v5.37h.51c.3 0 .6-.1.89-.3c.3-.2.45-.5.45-.9c0-.4-.15-.7-.45-.9m.2 4.41c-.49.38-1.07.57-1.74.57h-1.7v-7.3h1.77c.67 0 1.25.19 1.74.57c.48.38.73.9.73 1.56c0 .67-.24 1.18-.73 1.56m-5.88 4.29c-3.13-1.63-5.3-4.68-5.5-8.23c.31-.03 1.34.01 1.34.01s.88 0 .88-.93s-.88-.93-.88-.93s-.11-1.12-1.34-1.15c.2-3.55 2.37-6.6 5.5-8.23c1.94 1.22 3.25 3.19 3.82 5.41c-.81.02-1.4.61-1.4 1.45c0 .84.59 1.43 1.4 1.45c-.57 2.22-1.88 4.19-3.82 5.41Z"/></svg> },
        ]
      }
    ]
  },
  {
    category: "SEO Ranking",
    icon: <BarChart3 className="h-6 w-6" />,
    subCategories: [
      {
        title: "On-page & Off-page",
        skills: [
          { name: "Google Analytics", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20c4.42 0 8-3.58 8-8s-3.58-8-8-8s-8 3.58-8 8s3.58 8 8 8m-4.25-6.5h3v5h2.5v-5h3v-1.5h-8.5z"/></svg> },
          { name: "Google Search Console", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m16.82 7.42l-2.2-2.2l-1.42 1.4L15.38 9l-2.94 2.94l-2.12-2.12l-1.41 1.41l2.12 2.12l-2.56 2.56l1.41 1.41l2.56-2.56l2.12 2.12l1.41-1.41l-2.12-2.12l2.94-2.94l2.18 2.19l1.4-1.42zM12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20"/></svg> },
          { name: "Ahrefs", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m5.5 14h5a1 1 0 0 0 .83-.46l4.21-6.02a1 1 0 0 0-.04-1.3l-2.8-2.5a1 1 0 0 0-1.28-.06L12 9.42l-3.42-3.76a1 1 0 0 0-1.28.06l-2.8 2.5a1 1 0 0 0-.04 1.3l4.21 6.02a1 1 0 0 0 .83.46"/></svg> },
        ]
      },
      {
        title: "Technical SEO",
        skills: [
          { name: "Lighthouse", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 6.5l3.39 3.39L12 13.29l-3.39-3.4zM22 2l-8.5 8.5l-4-4L1 15l1.5 1.5L9 10l4 4l1.5-1.5l1.5-1.5l4.5-4.5L22 2z"/></svg> },
          { name: "Screaming Frog", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 15c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3m-4.8-3.4c-.66.66-1.54 1.1-2.5 1.25C4.24 15.22 4 14.66 4 14c0-2.21 1.79-4 4-4c.66 0 1.22.24 1.65.45c-.15.96-.6 1.84-1.25 2.55"/></svg> },
        ]
      }
    ]
  },
  {
    category: "Graphics Design",
    icon: <Palette className="h-6 w-6" />,
    subCategories: [
      {
        title: "Design Software",
        skills: [
          { name: "Adobe Photoshop", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22.5 20h-21A1.5 1.5 0 0 1 0 18.5v-13A1.5 1.5 0 0 1 1.5 4h21a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5M2.12 18h19.76V6H2.12Zm8.41-3.47h-4V9h3.75a1.88 1.88 0 0 1 1.9 1.83c0 .8-.56 1.33-1.22 1.57l1.5.23Zm-1.89-2.32h1.69c.39 0 .61-.26.61-.59s-.22-.58-.61-.58h-1.69Z"/></svg> },
          { name: "Adobe Illustrator", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22.5 20h-21A1.5 1.5 0 0 1 0 18.5v-13A1.5 1.5 0 0 1 1.5 4h21a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5M2.12 18h19.76V6H2.12Zm8.47-3.47L9 9h2.3l.79 3.12c.1.4.18.78.23 1.1h.06c.07-.37.15-.75.25-1.19L13.43 9h2.22l-1.68 5.53Z"/></svg> },
          { name: "Figma", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 5H14v5.5a2.5 2.5 0 1 1-5 0V5H7.5v5.5a4.5 4.5 0 1 0 9 0V5h-1Z"/></svg> },
          { name: "Canva", logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m5 13.5c-1.67 0-3.15-.9-3.84-2.25h-2.32c-.69 1.35-2.17 2.25-3.84 2.25s-3.15-.9-3.84-2.25H4.5v-1h2.66c.69-1.35 2.17-2.25 3.84-2.25s3.15.9 3.84 2.25h2.32c.69-1.35 2.17-2.25 3.84-2.25v1c-1.11 0-2.09.6-2.59 1.5h-2.34c-.5-1-1.48-1.5-2.57-1.5s-2.07.5-2.57 1.5H7.09c-.5-1-1.48-1.5-2.59-1.5v-1c1.67 0 3.15.9 3.84 2.25h2.32C11.35 9.9 12.83 9 14.5 9s3.15.9 3.84 2.25H19.5v1h-1.16c-.69 1.35-2.17 2.25-3.84 2.25s-3.15-.9-3.84-2.25h-2.32c-.69 1.35-2.17 2.25-3.84 2.25v-1c1.11 0 2.09-.6 2.59-1.5h2.34c.5 1 1.48 1.5 2.57 1.5s2.07-.5 2.57-1.5h2.27c.5 1 1.48 1.5 2.57 1.5z"/></svg> }
        ]
      }
    ]
  }
];

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

  const FilterDropdown = ({ label, options, selected, onSelect }: { label: string, options: string[], selected: string, onSelect: (value: string) => void }) => (
    <div className="grid w-full items-center gap-1.5">
        <Label htmlFor={label.toLowerCase()} className="text-sm font-semibold text-muted-foreground">{label}</Label>
        <Select value={selected} onValueChange={onSelect}>
            <SelectTrigger id={label.toLowerCase()} className="w-full bg-background/50">
                <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
                {options.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
            </SelectContent>
        </Select>
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

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-muted/30 backdrop-blur-sm p-6 md:p-8 rounded-2xl mb-12 border border-border"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FilterDropdown label="Filter by Category" options={allCategories} selected={selectedCategory} onSelect={setSelectedCategory} />
                <FilterDropdown label="Filter by Tool/Tag" options={allTags} selected={selectedTag} onSelect={setSelectedTag} />
            </div>
        </motion.div>


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
        
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-24"
        >
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary-foreground">My Technology Stack</h2>
                <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
                    A collection of tools and technologies I use to build modern, efficient, and beautiful applications.
                </p>
            </div>
            
            <div className="space-y-12">
                {techSkills.map((category, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                    >
                        <Card className="bg-muted/30 backdrop-blur-sm border-border shadow-lg">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                                    {category.icon}
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-primary-foreground">{category.category}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pl-16 pr-6 pb-6">
                                <div className="space-y-6">
                                    {category.subCategories.map((sub, subIndex) => (
                                        <div key={subIndex}>
                                            <h4 className="font-semibold text-lg text-primary-foreground mb-3">{sub.title}</h4>
                                            <div className="flex flex-wrap gap-4">
                                                {sub.skills.map((skill, skillIndex) => (
                                                    <div key={skillIndex} className="flex items-center gap-2 bg-background/50 py-2 px-3 rounded-lg border border-border/50" title={skill.name}>
                                                        <div className="w-6 h-6 flex items-center justify-center">{skill.logo}</div>
                                                        <span className="font-medium text-sm text-muted-foreground">{skill.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.section>

      </div>
    </div>
  );
}
