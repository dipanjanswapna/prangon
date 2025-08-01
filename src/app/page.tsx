'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Youtube, Sparkles, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AboutMe = () => {
  const text = "Hi! I’m Dipanjan “Swapna Prangon” Prangon from Dhaka, Bangladesh. As a passionate student, writer, and EdTech innovator, I founded Prangon’s Ecosystem to bridge creative design with education. I help students and educators through digital tools, branding, and movement-building learning content. With a keen eye for brand identity design, I craft logos, thumbnails, and visual stories that resonate.".split(' ');
  const [visibleWords, setVisibleWords] = useState<string[]>([]);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
           text.forEach((word, i) => {
              setTimeout(() => {
                  setVisibleWords(prev => [...prev, text.slice(0, i + 1).join(' ')]);
              }, i * 100);
           });
           observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if(aboutRef.current) {
          observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  const renderText = () => {
      const animatedText = visibleWords[visibleWords.length - 1] || "";
      const remainingText = text.join(' ').substring(animatedText.length);

      return (
          <>
              <span className="text-primary-foreground/80">{animatedText}</span>
              <span className="text-primary-foreground/20">{remainingText}</span>
          </>
      );
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
                  <h2 className="font-sans text-xl md:text-2xl font-normal leading-relaxed text-left max-w-2xl">
                      {renderText()}
                  </h2>
              </motion.div>
              <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8 }}
                  className="md:w-2/5 flex justify-center"
              >
                  <Image
                      src="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg"
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

const SkillsSection = () => {
  const skills = ["Web Development", "Programming Languages", "Graphic Design", "UI/UX Design", "Branding", "SEO"];
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const earthOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.3, 0.1]);
  const earthY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background text-foreground flex flex-col justify-center overflow-hidden">
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

const WhatTheySaidSection = () => {
  const testimonials = [
    {
      quote: "Dipanjan's branding work took our EdTech startup to the next level. The logo and visual identity perfectly capture our mission.",
      author: "Aarav Sharma",
      title: "CEO, Edufy",
      image: "https://placehold.co/100x100.png",
      imageAiHint: "man face",
    },
    {
      quote: "The learning materials designed by Prangon’s Ecosystem are both beautiful and effective. Our student engagement has skyrocketed.",
      author: "Nadia Islam",
      title: "Head of Curriculum, Shikho",
      image: "https://placehold.co/100x100.png",
      imageAiHint: "woman face",
    },
    {
      quote: "As a student, the digital tools he developed have been a game-changer for my study routine. Incredibly intuitive and helpful.",
      author: "Priya Das",
      title: "Student, University of Dhaka",
      image: "https://placehold.co/100x100.png",
      imageAiHint: "woman smiling",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
  
const InfoSection = () => {
    const toolboxItems = [
      { name: 'Express' }, { name: 'Node.js' }, { name: 'Flask' }, { name: 'Tailwind' },
      { name: 'Mongoose' }, { name: 'jQuery' }, { name: 'MySQL' }, { name: 'PostgreSQL' }
    ];
  
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
            className="bg-muted rounded-2xl p-6 flex flex-col justify-between col-span-1 row-span-2 shadow-lg"
          >
            <div>
              <h3 className="flex items-center text-xl font-bold mb-2">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                My Reads
              </h3>
              <p className="text-muted-foreground mb-4">Explore the books shaping my perspectives.</p>
            </div>
            <Image 
              src="https://placehold.co/400x600.png" 
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
                src="https://placehold.co/800x400.png"
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

const LatestVideosSection = () => {
    const videos = [
      {
        title: "কে জিতবে আগামী সংসদ নির্বাচনে? Dipanjan Swapna || The Untold",
        author: "Dipanjan Swapna",
        timestamp: "15 hours ago",
        thumbnail: "https://placehold.co/400x225.png",
        thumbnailAiHint: "youtube thumbnail politics",
      },
      {
        title: "ইউনুস সরকার আমেরিকার বাম্বু খাইতেছে কি? Dipanjan Swapna || The Untold",
        author: "Dipanjan Swapna",
        timestamp: "July 29, 2025 7:21 pm",
        thumbnail: "https://placehold.co/400x225.png",
        thumbnailAiHint: "youtube thumbnail news",
      },
      {
        title: "বিএনপির শেষ যাত্রা — কে রুখবে এই পতন? Dipanjan Swapna || The Untold",
        author: "Dipanjan Swapna",
        timestamp: "July 27, 2025 7:49 pm",
        thumbnail: "https://placehold.co/400x225.png",
        thumbnailAiHint: "youtube thumbnail analysis",
      },
    ];

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
                <h3 className="text-xl sm:text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
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

  const title = "SMILE FOR MILES".split(" ");

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
            src="https://scontent.fdac138-1.fna.fbcdn.net/v/t39.30808-6/489643954_1207618031366053_6391368232504397889_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=bybr_YZJzsUQ7kNvwFkUVAN&_nc_oc=AdknBg_ukuAGHBLRTJ3Z23JbDfxZOAVYo6-Kh_2pziZc2q3gqRlUagLlkiogSv0V5dU&_nc_zt=23&_nc_ht=scontent.fdac138-1.fna&_nc_gid=Ep4pWuNIWrzdeH-MHntHnw&oh=00_AfR85qb8KAeVlYCXXzNw4eT8e7SX-_Hejf8RFCRoD84ZFA&oe=6892201F"
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
            WELCOME TO PRANGON CENTRE
          </motion.p>
          <motion.h1 
            variants={titleContainer}
            initial="hidden"
            animate="visible"
            className="font-headline text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none tracking-tighter"
          >
           {title.map((word, index) => (
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
                {index < title.length -1 && <span>&nbsp;</span>}
            </span>
           ))}
          </motion.h1>
        </div>
      </div>
      <AboutMe />
      <SkillsSection />
      <WhatTheySaidSection />
      <InfoSection />
      <LatestVideosSection />
    </>
  );
}
