
'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Youtube, Sparkles, ChevronsRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getHomePageContent } from './admin/home/actions';
import { HomePageData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


const AboutMe = ({ text, imageUrl } : { text: string, imageUrl: string }) => {
  const words = text.split(' ');
  const aboutRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
      <div ref={aboutRef} className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-32">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
              <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8 }}
                  className="md:w-3/5"
              >
                  <p className="text-sm tracking-[0.3em] mb-6 text-muted-foreground uppercase">About Me</p>
                  <motion.h2 
                      className="font-sans text-xl md:text-2xl font-normal leading-relaxed text-left max-w-2xl text-primary-foreground/80"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                  >
                      {words.map((word, index) => (
                          <motion.span key={index} variants={wordVariants} className="inline-block mr-[0.25em]">
                              {word}
                          </motion.span>
                      ))}
                  </motion.h2>
              </motion.div>
              <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8 }}
                  className="md:w-2/5 flex justify-center"
              >
                  <Image
                      src={imageUrl}
                      alt="Dipanjan Prangon"
                      width={300}
                      height={300}
                      className="rounded-full object-cover w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] border-4 border-primary/20 shadow-lg"
                      data-ai-hint="profile picture"
                  />
              </motion.div>
          </div>
      </div>
  );
};

const SkillsSection = ({ skills } : { skills: string[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const earthOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.3, 0.1]);
  const earthY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background text-foreground flex flex-col justify-center overflow-hidden py-16 px-4">
      <motion.div
        className="absolute inset-0 z-0"
        style={{ opacity: earthOpacity, y: earthY }}
      >
        <Image
          src="https://images.pond5.com/3d-animation-earth-rotation-looped-085333912_prevstill.jpeg"
          alt="Earth"
          className="object-cover w-full h-full"
          data-ai-hint="dark earth globe"
          fill
        />
      </motion.div>
      <div className="relative z-10 container mx-auto px-4">
        {skills.map((skill, index) => {
          const start = index / skills.length;
          const end = (index + 1) / skills.length;
          const opacity = useTransform(scrollYProgress, [start, (start + end) / 2, end], [0.2, 1, 0.2]);

          return (
            <motion.div
              key={skill}
              className="py-4 md:py-8 border-b border-border"
              style={{ opacity }}
            >
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase text-center text-primary-foreground">
                {skill}
              </h2>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const WhatTheySaidSection = ({ testimonials }: { testimonials: any[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[activeIndex];

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="md:w-3/4 text-center md:text-left">
          <div className="relative h-auto md:h-64">
             <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="absolute -top-8 -left-4 text-8xl font-black hidden md:block text-primary">“</motion.span>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="inset-0"
              >
                <h2 className="font-headline text-3xl md:text-5xl font-bold leading-tight text-primary-foreground">
                  {currentTestimonial.quote}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8">
            <p className="text-xl font-semibold text-primary-foreground">{currentTestimonial.author}</p>
            <p className="text-lg text-muted-foreground">{currentTestimonial.title}</p>
          </motion.div>
        </div>
        <div className="md:w-1/4 flex flex-row md:flex-col items-center justify-center gap-4 mt-8 md:mt-0">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex items-center"
            >
               {index === activeIndex && (
                <div className="hidden md:block absolute -left-6 text-primary">
                  <ChevronsRight size={24} />
                </div>
              )}
              <Image
                src={testimonial.image}
                alt={testimonial.author}
                width={80}
                height={80}
                data-ai-hint={testimonial.imageAiHint}
                className={`rounded-full cursor-pointer transition-all duration-300 w-16 h-16 sm:w-20 sm:h-20 ${
                  index === activeIndex ? 'scale-110 border-4 border-primary' : 'opacity-50 hover:opacity-75'
                }`}
                onClick={() => setActiveIndex(index)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
  
const InfoSection = ({ toolboxItems, readsImage, hobbiesImage } : { toolboxItems: {name: string}[], readsImage: string, hobbiesImage: string }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({ 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.6, delay: i * 0.1 } 
        })
    };
  
    return (
      <div className="bg-background text-foreground p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-muted rounded-2xl p-6 flex flex-col justify-between col-span-1 lg:row-span-2 shadow-lg"
          >
            <div>
              <h3 className="flex items-center text-xl font-bold mb-2">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                My Reads
              </h3>
              <p className="text-muted-foreground mb-4">Explore the books shaping my perspectives.</p>
            </div>
            <Image 
              src={readsImage}
              alt="Atomic Habits book cover" 
              width={400} 
              height={600} 
              className="w-full h-auto rounded-lg object-cover mt-auto" 
              data-ai-hint="book cover" 
            />
          </motion.div>
  
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-muted rounded-2xl p-6 col-span-1 lg:col-span-2 shadow-lg"
          >
            <h3 className="flex items-center text-xl font-bold mb-2">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              My Toolbox
            </h3>
            <p className="text-muted-foreground mb-6">Explore the technologies and tools I use to create awesome digital experiences.</p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {toolboxItems.map((item, index) => (
                <motion.div 
                    key={item.name} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-background rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm flex items-center"
                >
                  {item.name}
                </motion.div>
              ))}
            </div>
          </motion.div>
  
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-muted rounded-2xl p-6 col-span-1 lg:col-span-2 relative overflow-hidden min-h-[200px] md:h-auto flex flex-col justify-center shadow-lg"
          >
             <div className="relative z-10">
                <h3 className="flex items-center text-xl font-bold mb-2">
                    <Sparkles className="h-5 w-5 mr-2 text-primary" />
                    My Hobbies
                </h3>
                <p className="text-muted-foreground">Explore my interests, hobbies, and other things I enjoy doing beyond the digital realm.</p>
             </div>
             <Image 
                src={hobbiesImage}
                alt="Map of Dhaka"
                className="object-cover opacity-10 z-0"
                data-ai-hint="map Dhaka"
                fill
             />
          </motion.div>
  
        </div>
      </div>
    );
}

const LatestVideosSection = ({ videos }: { videos: any[] }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };
  
    return (
      <div className="bg-background text-foreground p-8 md:p-16">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            <p className="text-lg text-primary">Visit and Play</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-widest text-muted-foreground uppercase">
              Latest Videos and Subscribe
            </h2>
          </motion.div>
  
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-muted rounded-2xl p-6 sm:p-8 mb-8 shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <Image 
                  src="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg" 
                  alt="Dipanjan Swapna" 
                  width={100} 
                  height={100} 
                  className="rounded-full w-20 h-20 sm:w-24 sm:h-24 border-2 border-primary"
                  data-ai-hint="profile picture"
                />
              </div>
              <div className='text-center md:text-left'>
                <h3 className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2">
                  Dipanjan Swapna <span className="text-base font-normal text-muted-foreground">· 100K subscribers</span>
                </h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-2xl">
                  As a passionate student, writer, and EdTech innovator, I founded Prangon’s Ecosystem to bridge creative design with education. I help students and educators through digital tools, branding, and movement-building learning content. With a keen eye for brand identity design, I craft logos, thumbnails, and visual stories that resonate.
                </p>
              </div>
            </div>
          </motion.div>
  
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
          >
            {videos.map((video, index) => (
              <motion.div 
                key={index}
                variants={itemVariants} 
                className="bg-muted rounded-lg overflow-hidden group shadow-lg"
              >
                <div className="relative">
                  <Image 
                    src={video.thumbnail} 
                    alt={video.title}
                    width={400} 
                    height={225} 
                    className="w-full h-auto"
                    data-ai-hint={video.thumbnailAiHint}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Youtube className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-base sm:text-lg mb-2 text-primary-foreground">{video.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{video.author} · {video.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
  
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='w-full sm:w-auto'>
              <Button variant="outline" className="w-full sm:w-auto">Load More...</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='w-full sm:w-auto'>
              <a href="https://www.youtube.com/@dipanjanswapna" target="_blank" rel="noopener noreferrer" className='w-full sm:w-auto'>
                <Button className="bg-red-600 hover:bg-red-700 text-white w-full">
                  <Youtube className="mr-2 h-5 w-5" />
                  Subscribe
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

export default function Home() {
  const [content, setContent] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const homePageData = await getHomePageContent();
        setContent(homePageData);
      } catch (error) {
        console.error("Failed to fetch home page content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading || !content) {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading Prangon Centre...</p>
        </div>
    );
  }

  const titleWords = content.heroTitle.split(" ");

  const titleContainer = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 * i },
    }),
  };

  const titleItem = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
  };

  return (
    <>
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={content.heroBackgroundImageUrl}
            alt="Minh Pham"
            className="object-cover opacity-30"
            priority
            data-ai-hint="man portrait"
            fill
          />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4 text-primary-foreground">
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base tracking-[0.2em] md:tracking-[0.3em] mb-4 uppercase"
          >
            {content.heroWelcomeText}
          </motion.p>
          <motion.h1 
            variants={titleContainer}
            initial="hidden"
            animate="visible"
            className="font-headline text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none tracking-tighter"
          >
           {titleWords.map((word, index) => (
             <span key={index} className="inline-block">
                {word === "FOR" ? (
                    <motion.span variants={titleItem} className="text-primary">FOR&nbsp;</motion.span>
                ) : (
                    word.split("").map((char, charIndex) => (
                        <motion.span key={charIndex} variants={titleItem} className="inline-block">
                            {char}
                        </motion.span>
                    ))
                )}
                {index < titleWords.length -1 && <span>&nbsp;</span>}
            </span>
           ))}
          </motion.h1>
        </div>
      </div>
      <AboutMe text={content.aboutMeText} imageUrl={content.aboutMeImageUrl}/>
      <SkillsSection skills={content.skills} />
      <WhatTheySaidSection testimonials={content.testimonials}/>
      <InfoSection toolboxItems={content.toolboxItems} readsImage={content.readsImage} hobbiesImage={content.hobbiesImage} />
      <LatestVideosSection videos={content.videos} />
    </>
  );
}
