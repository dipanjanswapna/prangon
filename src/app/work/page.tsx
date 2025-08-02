

import { motion } from 'framer-motion';
import { Briefcase, Paintbrush, TrendingUp, Trophy, ArrowRight, ExternalLink, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { experiences } from '@/lib/experiences';
import { achievements } from '@/lib/achievements';
import { getProjects } from '../admin/projects/actions';
import type { Project } from '@/lib/projects';


const visualArts = [
  { imageUrl: 'https://placehold.co/400x400.png', imageAiHint: 'abstract art', title: 'Cosmic Dream' },
  { imageUrl: 'https://placehold.co/400x400.png', imageAiHint: 'portrait painting', title: 'Serenity' },
  { imageUrl: 'https://placehold.co/400x400.png', imageAiHint: 'landscape illustration', title: 'Silent Valley' },
];

const homeExperiences = experiences.slice(0, 3);
const homeAchievements = achievements.slice(0, 3);


// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const SectionHeader = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <motion.div variants={itemVariants} className="mb-8">
    <div className="flex items-center gap-4 mb-2">
      {icon}
      <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary-foreground">{title}</h2>
    </div>
    <p className="text-muted-foreground md:text-lg max-w-3xl">{description}</p>
  </motion.div>
);

export default async function WorkPage() {
    const professionalProjects: Project[] = (await getProjects()).slice(0, 2);

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
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-primary-foreground uppercase">
            My Work
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mt-4 max-w-4xl mx-auto">
            A curated showcase of my professional projects, creative endeavors, experiences, and achievements.
          </p>
           <div className="mt-8">
                <Link href="/admin/dashboard">
                    <Button size="lg" variant="outline">
                        <Shield className="mr-2 h-5 w-5" />
                        Admin Panel
                    </Button>
                </Link>
            </div>
        </motion.header>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-24">
          
          {/* Professional Projects Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
                icon={<Briefcase className="h-8 w-8 text-primary" />} 
                title="Professional Projects"
                description="A selection of my best client work, ranging from UI/UX design to complete branding projects."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {professionalProjects.map((project, index) => (
                <motion.div key={project.slug} variants={itemVariants}>
                  <Card className="bg-muted/30 group overflow-hidden h-full flex flex-col backdrop-blur-sm shadow-lg">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
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
                    <CardContent className="p-6 flex-grow">
                      <CardTitle className="text-xl font-bold mb-2">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </div>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Link href={`/projects/${project.slug}`}>
                        <Button variant="outline" className="w-full">
                          View Case Study <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <motion.div variants={itemVariants} className="text-center mt-8">
                <Link href={"/work/projects"}>
                    <Button size="lg">View Full Portfolio</Button>
                </Link>
            </motion.div>
          </motion.section>

          {/* Visual Arts Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
                icon={<Paintbrush className="h-8 w-8 text-primary" />} 
                title="Visual Arts"
                description="A glimpse into my creative side, featuring illustrations, graphics, and other visual pieces."
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {visualArts.map((art, index) => (
                <motion.div key={index} variants={itemVariants} className="relative rounded-lg overflow-hidden group">
                  <Image
                    src={art.imageUrl}
                    alt={art.title}
                    width={400}
                    height={400}
                    data-ai-hint={art.imageAiHint}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold text-lg">{art.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
             <motion.div variants={itemVariants} className="text-center mt-8">
                <Link href="/visual-arts">
                    <Button size="lg">View Full Art Gallery</Button>
                </Link>
            </motion.div>
          </motion.section>

          {/* Experiences Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
                icon={<TrendingUp className="h-8 w-8 text-primary" />} 
                title="Experiences"
                description="A timeline of my professional journey, including freelance work, teaching, and leadership roles."
            />
            <div className="relative border-l-2 border-primary/20 pl-8 space-y-12">
              {homeExperiences.map((exp, index) => (
                <motion.div key={exp.id} variants={itemVariants} className="relative">
                   <div className="absolute -left-[38px] top-1 h-4 w-4 rounded-full bg-primary ring-8 ring-background" />
                   <h3 className="text-xl font-bold text-primary-foreground">{exp.role}</h3>
                   <p className="text-primary font-semibold">{exp.entity}</p>
                   <p className="text-sm text-muted-foreground mb-2">{exp.period}</p>
                   <p className="text-muted-foreground">{exp.description[0]}</p>
                </motion.div>
              ))}
            </div>
             <motion.div variants={itemVariants} className="text-center mt-8">
                <Link href="/experiences">
                    <Button size="lg">View Full Experiences</Button>
                </Link>
            </motion.div>
          </motion.section>

          {/* Achievements Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
                icon={<Trophy className="h-8 w-8 text-primary" />} 
                title="Achievements"
                description="A collection of my awards, certifications, and other notable recognitions."
            />
            <div className="space-y-4">
              {homeAchievements.map((ach, index) => (
                 <motion.div key={ach.id} variants={itemVariants}>
                    <Card className="bg-muted/30 hover:bg-muted/50 transition-colors backdrop-blur-sm">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-primary-foreground">{ach.title}</h4>
                                <p className="text-sm text-muted-foreground">{ach.issuer}</p>
                            </div>
                            <Badge variant="outline">{ach.date}</Badge>
                        </CardContent>
                    </Card>
                 </motion.div>
              ))}
            </div>
             <motion.div variants={itemVariants} className="text-center mt-8">
                <Link href="/achievements">
                    <Button size="lg">View Full Achievements</Button>
                </Link>
            </motion.div>
          </motion.section>

        </motion.div>
      </div>
    </div>
  );
}
