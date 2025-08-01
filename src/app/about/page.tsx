'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const skills = ['UI/UX Design', 'Web Design', 'Branding', 'Figma', 'Next.js', 'Tailwind CSS', 'Prototyping'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-muted/50 border-border shadow-lg">
            <CardHeader className="text-center">
              <motion.div variants={itemVariants} className="flex justify-center mb-6">
                <Avatar className="h-32 w-32 border-4 border-background ring-4 ring-primary">
                  <AvatarImage src="https://placehold.co/200x200.png" alt="Designer's profile picture" data-ai-hint="profile picture" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-4xl font-bold font-headline tracking-tight text-primary-foreground">About Me</motion.h1>
              <motion.p variants={itemVariants} className="text-xl text-muted-foreground mt-2">I'm Jane Doe, a passionate designer and developer.</motion.p>
            </CardHeader>
            <CardContent className="text-lg text-foreground/80 space-y-6 px-6 md:px-12 pb-12">
              <motion.p variants={itemVariants}>
                I specialize in creating beautiful, functional, and user-centered digital experiences. With a background in both design and front-end development, I bridge the gap between aesthetics and technology to build products that are not only visually stunning but also intuitive and performant.
              </motion.p>
              <motion.p variants={itemVariants}>
                My design philosophy is rooted in minimalism and clarity. I believe that great design is about removing the unnecessary, allowing the core message and functionality to shine. I'm constantly learning and exploring new technologies to push the boundaries of what's possible on the web.
              </motion.p>
              <motion.div variants={itemVariants}>
                <h3 className="text-2xl font-semibold font-headline mb-4 text-primary-foreground">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
                  ))}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
