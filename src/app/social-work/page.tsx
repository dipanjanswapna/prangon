
'use client';

import { motion } from 'framer-motion';
import { HandHeart, BookOpen, Trees, Users, Heart, Award, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const initiatives = [
  {
    title: 'EduCare Initiative',
    category: 'Education',
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    description: 'Providing free tutoring and educational materials to underprivileged students in local communities.',
    impact: 'Reached 200+ students, improving literacy rates by 15% in the target area.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'children studying',
    tags: ['Education', 'Community', 'Tutoring'],
  },
  {
    title: 'Green Earth Project',
    category: 'Environment',
    icon: <Trees className="h-8 w-8 text-primary" />,
    description: 'Organized tree plantation drives and awareness campaigns about climate change.',
    impact: 'Planted over 1,000 saplings and conducted 5 awareness seminars in schools.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'tree plantation',
    tags: ['Environment', 'Climate Action', 'Volunteering'],
  },
  {
    title: 'Community Kitchen',
    category: 'Humanitarian',
    icon: <Users className="h-8 w-8 text-primary" />,
    description: 'A weekly program to provide warm meals for the homeless and daily wage earners.',
    impact: 'Served over 5,000 meals in the last year, providing crucial support during the pandemic.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'serving food',
    tags: ['Food Drive', 'Humanitarian', 'Community Support'],
  },
];

const testimonials = [
  {
    quote: 'The EduCare initiative has been a blessing for my children. They are more confident in their studies now.',
    author: 'Amina Begum',
    role: 'Parent',
    imageUrl: 'https://placehold.co/100x100.png',
    imageAiHint: 'smiling woman',
  },
  {
    quote: 'Dipanjan’s dedication to community service is truly inspiring. He motivates everyone around him.',
    author: 'Mr. Rahman',
    role: 'Community Leader',
    imageUrl: 'https://placehold.co/100x100.png',
    imageAiHint: 'man portrait',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
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

export default function SocialWorkPage() {
  return (
    <div className="bg-background min-h-screen relative">
       <Image
          src="https://cdnb.artstation.com/p/assets/images/images/060/998/715/large/srabon-arafat-53.jpg?1679785068"
          alt="Social work background"
          fill
          className="fixed inset-0 z-0 object-cover opacity-10"
          data-ai-hint="abstract background"
        />
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative text-center mb-16 rounded-lg overflow-hidden"
        >
           <div className="py-16 md:py-24">
            <div className="relative z-10">
                <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                   <HandHeart className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-primary-foreground uppercase">
                  Social Work & Contributions
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
                  Driven by a passion for positive change, I am dedicated to creating a tangible impact in my community through various initiatives.
                </p>
            </div>
           </div>
        </motion.header>

        <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-24"
        >
            <motion.div variants={itemVariants} className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary-foreground">My Initiatives</h2>
                 <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto mt-2">Here are some of the projects I've been privileged to lead and contribute to.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initiatives.map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="bg-muted/30 group overflow-hidden h-full flex flex-col backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-xl hover:scale-105">
                            <CardHeader className="flex flex-col items-center text-center p-6">
                                <div className="p-3 bg-primary/10 rounded-full mb-4">
                                  {item.icon}
                                </div>
                                <CardTitle className="text-xl font-bold mb-1">{item.title}</CardTitle>
                                <Badge variant="secondary">{item.category}</Badge>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 text-center flex-grow">
                                <CardDescription className="mb-4">{item.description}</CardDescription>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    width={600}
                                    height={400}
                                    data-ai-hint={item.imageAiHint}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                 <div className="text-left">
                                     <h4 className="font-semibold mb-1 text-primary-foreground">Impact:</h4>
                                     <p className="text-sm text-muted-foreground">{item.impact}</p>
                                 </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.section>

        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-24"
        >
            <motion.div variants={itemVariants} className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary-foreground">Stories of Change</h2>
                 <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto mt-2">The true measure of our work lies in the lives we touch.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {testimonials.map((testimonial, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="bg-muted/30 h-full p-6 text-center rounded-xl backdrop-blur-sm">
                            <Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-primary/20">
                                <AvatarImage src={testimonial.imageUrl} alt={testimonial.author} data-ai-hint={testimonial.imageAiHint} />
                                <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <blockquote className="text-muted-foreground italic mb-4">"{testimonial.quote}"</blockquote>
                            <p className="font-bold text-primary-foreground">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.section>

         <motion.section 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
         >
            <Card className="bg-primary/10 backdrop-blur-sm rounded-xl p-8 md:p-12 text-center">
                <div className="max-w-3xl mx-auto">
                    <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl md:text-3xl font-bold font-headline text-primary-foreground mb-4">Future Plans & Vision</h2>
                    <p className="text-muted-foreground md:text-lg mb-6">
                        My goal is to scale these initiatives through my "Prangon's Ecosystem", leveraging technology to connect volunteers, donors, and beneficiaries more effectively. I believe higher education will equip me with the skills and network to turn this vision into a global reality.
                    </p>
                    <Link href="/contact">
                       <Button size="lg">
                            Get Involved <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </Card>
         </motion.section>

      </div>
    </div>
  );
}
