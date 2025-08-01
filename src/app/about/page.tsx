
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Star, Target, BrainCircuit, Users, Lightbulb, GraduationCap, Briefcase, Award, MessageSquare, Handshake, DollarSign, Clock } from 'lucide-react';
import Image from 'next/image';


const UniversityFeatures = [
    { 
        title: "Academic Excellence", 
        description: "Achieved a CGPA of 3.9/4.0, complemented by multiple academic awards and honors for outstanding performance.",
        icon: <GraduationCap className="h-6 w-6 text-primary" />
    },
    { 
        title: "Research & Innovation", 
        description: "Contributed to a significant research project on [Your Research Topic], leading to [Outcome or Publication].",
        icon: <Lightbulb className="h-6 w-6 text-primary" />
    },
    { 
        title: "Leadership & Teamwork", 
        description: "Led a team of 5 in [Project Name], fostering collaboration and achieving our goals ahead of schedule.",
        icon: <Users className="h-6 w-6 text-primary" />
    },
    { 
        title: "Problem-Solving & Adaptability", 
        description: "Developed a novel solution for [A Specific Problem], demonstrating adaptability in a fast-paced environment.",
        icon: <BrainCircuit className="h-6 w-6 text-primary" />
    },
    { 
        title: "Future Goals & Motivation", 
        description: "Aiming to pursue a PhD in [Your Field] to contribute to [Your Ultimate Goal], driven by a passion for discovery.",
        icon: <Target className="h-6 w-6 text-primary" />
    },
     { 
        title: "Awards & Recognition", 
        description: "Recipient of the 'Innovator of the Year' award for developing a groundbreaking EdTech tool.",
        icon: <Award className="h-6 w-6 text-primary" />
    },
];

const ClientFeatures = [
    {
        title: "Client Testimonials",
        description: "My clients consistently praise my work for its quality, creativity, and impact on their business.",
        icon: <MessageSquare className="h-6 w-6 text-primary" />
    },
    {
        title: "Efficient Working Process",
        description: "I follow a streamlined process: Discovery > Strategy > Design > Feedback > Delivery, ensuring clarity and quality.",
        icon: <Handshake className="h-6 w-6 text-primary" />
    },
    {
        title: "Transparent Pricing",
        description: "Clear and upfront pricing with no hidden fees. I offer packages tailored to your specific needs and budget.",
        icon: <DollarSign className="h-6 w-6 text-primary" />
    },
    {
        title: "Timely Delivery",
        description: "I am committed to delivering high-quality work on time, every time, helping you meet your launch deadlines.",
        icon: <Clock className="h-6 w-6 text-primary" />
    },
]


export default function AboutPage() {

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
    <div className="relative min-h-screen py-8 md:py-12">
        <Image
            src="https://cdnb.artstation.com/p/assets/images/images/057/331/063/large/srabon-arafat-uploded-file-x.jpg?1671322270"
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
                <Avatar className="h-32 w-32 border-4 border-background ring-4 ring-primary">
                  <AvatarImage src="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg" alt="Dipanjan Prangon" data-ai-hint="profile picture" />
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary-foreground">
                Dipanjan “Swapna Prangon” Prangon
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
                A passionate student, writer, and EdTech innovator from Dhaka, Bangladesh, dedicated to bridging creative design with education.
              </motion.p>
            </motion.div>

            <Tabs defaultValue="academia" className="w-full mt-12">
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex justify-center">
                <TabsList className="grid w-full grid-cols-2 max-w-md bg-background/80 backdrop-blur-sm">
                  <TabsTrigger value="academia">For Academia & Scholarships</TabsTrigger>
                  <TabsTrigger value="services">For Professional Services</TabsTrigger>
                </TabsList>
              </motion.div>

              <TabsContent value="academia">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  <Card className="bg-muted/30 mt-6 border-border shadow-lg backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl md:text-3xl text-center font-headline text-primary-foreground">Why I'm a Strong Candidate for Your University</CardTitle>
                       <CardDescription className="text-center text-muted-foreground">My goal is to leverage higher education to create impactful technological solutions for the developing world. </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                      {UniversityFeatures.map((feature, index) => (
                        <motion.div key={feature.title} variants={itemVariants}>
                            <Card className="h-full bg-background/50 hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    {feature.icon}
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
                            <CardTitle className="text-2xl md:text-3xl text-center font-headline text-primary-foreground">How I Deliver Value to My Clients</CardTitle>
                             <CardDescription className="text-center text-muted-foreground">I combine creative design with strategic thinking to help brands and educators make a lasting impact.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Accordion type="single" collapsible className="w-full">
                               <motion.div variants={itemVariants}>
                                  <AccordionItem value="item-1">
                                    <AccordionTrigger className="font-semibold text-lg">Portfolio & Past Projects</AccordionTrigger>
                                    <AccordionContent>
                                      I have successfully completed over 50 projects ranging from brand identity design to web development for clients worldwide. You can view my selected works on the "Work" page to see the quality and creativity I bring to the table.
                                    </AccordionContent>
                                  </AccordionItem>
                               </motion.div>
                               <motion.div variants={itemVariants}>
                                  <AccordionItem value="item-2">
                                    <AccordionTrigger className="font-semibold text-lg">Unique Selling Proposition (USP)</AccordionTrigger>
                                    <AccordionContent>
                                      My key differentiator is the blend of educational insight with design excellence. I don't just create visuals; I create learning experiences and brand stories that educate, engage, and inspire action.
                                    </AccordionContent>
                                  </AccordionItem>
                               </motion.div>
                            </Accordion>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {ClientFeatures.map((feature, index) => (
                                    <motion.div key={feature.title} variants={itemVariants}>
                                        <Card className="h-full bg-background/50 hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader className="flex flex-row items-center gap-4">
                                                {feature.icon}
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
          </div>
      </div>
    </div>
  );
}
