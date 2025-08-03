
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Star, Target, BrainCircuit, Users, Lightbulb, GraduationCap, Briefcase, Award, MessageSquare, Handshake, DollarSign, Clock, UserCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getAboutPageContent } from '../admin/about/actions';
import { AboutPageData } from '@/lib/types';


const iconMap: { [key: string]: React.ReactElement } = {
    "Academic Excellence": <GraduationCap className="h-6 w-6 text-primary" />,
    "Research & Innovation": <Lightbulb className="h-6 w-6 text-primary" />,
    "Leadership & Teamwork": <Users className="h-6 w-6 text-primary" />,
    "Problem-Solving & Adaptability": <BrainCircuit className="h-6 w-6 text-primary" />,
    "Future Goals & Motivation": <Target className="h-6 w-6 text-primary" />,
    "Awards & Recognition": <Award className="h-6 w-6 text-primary" />,
    "Client Testimonials": <MessageSquare className="h-6 w-6 text-primary" />,
    "Efficient Working Process": <Handshake className="h-6 w-6 text-primary" />,
    "Transparent Pricing": <DollarSign className="h-6 w-6 text-primary" />,
    "Timely Delivery": <Clock className="h-6 w-6 text-primary" />,
};


export default function AboutPage() {
  const [data, setData] = useState<AboutPageData | null>(null);

  useEffect(() => {
      getAboutPageContent().then(setData);
  }, [])

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
  
  if (!data) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16 md:py-24">
        <Image
            src={data.backgroundImageUrl}
            alt="About background"
            fill
            className="absolute inset-0 z-0 object-cover opacity-20"
            data-ai-hint="abstract background"
        />
      <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div variants={itemVariants} className="flex justify-center mb-6">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background ring-4 ring-primary">
                  <AvatarImage src={data.profileImageUrl} alt={data.name} data-ai-hint="profile picture" />
                  <AvatarFallback>{data.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary-foreground">
                {data.name}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
                {data.tagline}
              </motion.p>
            </motion.div>

            <Tabs defaultValue="academia" className="w-full mt-12">
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex justify-center">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 max-w-md bg-background/80 backdrop-blur-sm">
                  <TabsTrigger value="academia">For Academia & Scholarships</TabsTrigger>
                  <TabsTrigger value="services">For Professional Services</TabsTrigger>
                </TabsList>
              </motion.div>

              <TabsContent value="academia">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <Card className="bg-muted/30 mt-6 border-border shadow-lg backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl md:text-3xl text-center font-headline text-primary-foreground">{data.academia.title}</CardTitle>
                       <CardDescription className="text-center text-muted-foreground">{data.academia.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                      {data.academia.features.map((feature) => (
                        <motion.div key={feature.title} variants={itemVariants}>
                            <Card className="h-full bg-background/50 hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    {iconMap[feature.title] || <Star className="h-6 w-6 text-primary" />}
                                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="services">
                 <motion.div variants={containerVariants} initial="hidden" animate="visible">
                     <Card className="bg-muted/30 mt-6 border-border shadow-lg backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl md:text-3xl text-center font-headline text-primary-foreground">{data.services.title}</CardTitle>
                             <CardDescription className="text-center text-muted-foreground">{data.services.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Accordion type="single" collapsible className="w-full">
                               {data.services.accordionItems.map((item, index) => (
                                 <motion.div key={index} variants={itemVariants}>
                                    <AccordionItem value={`item-${index+1}`}>
                                        <AccordionTrigger className="font-semibold text-lg">{item.title}</AccordionTrigger>
                                        <AccordionContent>{item.content}</AccordionContent>
                                    </AccordionItem>
                                 </motion.div>
                               ))}
                            </Accordion>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {data.services.features.map((feature) => (
                                    <motion.div key={feature.title} variants={itemVariants}>
                                        <Card className="h-full bg-background/50 hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader className="flex flex-row items-center gap-4">
                                                {iconMap[feature.title] || <Star className="h-6 w-6 text-primary" />}
                                                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                     </Card>
                </motion.div>
              </TabsContent>
            </Tabs>

             <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-12"
              >
                <Card className="bg-muted/30 mt-6 border-border shadow-lg backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center gap-4">
                     <UserCircle className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl md:text-3xl font-headline text-primary-foreground">Biography</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {data.biography}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

          </div>
      </div>
    </div>
  );
}
