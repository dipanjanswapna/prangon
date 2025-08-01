
'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsRight, Sparkles } from 'lucide-react';

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
                <span style={{ color: 'rgb(184, 172, 152)' }}>{animatedText}</span>
                <span style={{ color: 'rgb(184, 172, 152)', opacity: 0.2 }}>{remainingText}</span>
            </>
        );
    };
  
    return (
        <div ref={aboutRef} className="min-h-screen flex items-center justify-center px-8 md:px-16 lg:px-32" style={{ backgroundColor: '#141414' }}>
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-3/5">
                    <p className="text-sm tracking-[0.3em] mb-6" style={{ color: 'rgb(184, 172, 152, 0.7)' }}>ABOUT ME</p>
                    <h2 className="font-sans text-xl md:text-2xl font-normal leading-relaxed text-left max-w-2xl">
                        {renderText()}
                    </h2>
                </div>
                <div className="md:w-2/5 flex justify-center">
                    <Image
                        src="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg"
                        alt="Dipanjan Prangon"
                        width={300}
                        height={300}
                        className="rounded-full object-cover"
                        data-ai-hint="profile picture"
                    />
                </div>
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
    <div ref={containerRef} className="relative min-h-screen bg-black text-white flex flex-col justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          opacity: earthOpacity,
          y: earthY,
        }}
      >
        <Image
          src="https://images.pond5.com/3d-animation-earth-rotation-looped-085333912_prevstill.jpeg"
          alt="Earth"
          layout="fill"
          objectFit="cover"
          data-ai-hint="dark earth globe"
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
              className="py-8 border-b border-gray-700"
              style={{ opacity }}
            >
              <h2 className="text-6xl md:text-8xl font-black uppercase text-center" style={{ color: 'rgb(184, 172, 152)' }}>
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
        title: "CEO",
        company: "Edufy",
        image: "https://placehold.co/100x100.png",
        imageAiHint: "man face",
      },
      {
        quote: "The learning materials designed by Prangon’s Ecosystem are both beautiful and effective. Our student engagement has skyrocketed.",
        author: "Nadia Islam",
        title: "Head of Curriculum",
        company: "Shikho",
        image: "https://placehold.co/100x100.png",
        imageAiHint: "woman face",
      },
      {
        quote: "As a student, the digital tools he developed have been a game-changer for my study routine. Incredibly intuitive and helpful.",
        author: "Priya Das",
        title: "Student",
        company: "University of Dhaka",
        image: "https://placehold.co/100x100.png",
        imageAiHint: "woman smiling",
      },
    ];
  
    const [activeIndex, setActiveIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000); // Change testimonial every 5 seconds
      return () => clearInterval(interval);
    }, [testimonials.length]);
  
    const currentTestimonial = testimonials[activeIndex];
  
    return (
      <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-8 overflow-hidden">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-3/4">
            <div className="relative h-64 md:h-72">
              <span className="absolute -top-8 -left-4 text-8xl font-black" style={{color: 'rgb(235, 89, 56)'}}>“</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{color: 'rgb(184, 172, 152)'}}>
                    {currentTestimonial.quote}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-8">
              <p className="text-xl font-semibold" style={{color: 'rgb(184, 172, 152)'}}>{currentTestimonial.author}</p>
              <p className="text-lg text-gray-400">{currentTestimonial.title}</p>
              <p className="text-lg text-gray-500">{currentTestimonial.company}</p>
            </div>
          </div>
          <div className="md:w-1/4 flex flex-row md:flex-col items-center justify-center gap-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative flex items-center">
                 {index === activeIndex && (
                  <div className="hidden md:block absolute -left-6 text-orange-500">
                    <ChevronsRight size={24} style={{color: 'rgb(235, 89, 56)'}}/>
                  </div>
                )}
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  width={80}
                  height={80}
                  data-ai-hint={testimonial.imageAiHint}
                  className={`rounded-full cursor-pointer transition-all duration-300 ${
                    index === activeIndex ? 'scale-110 border-4 border-orange-500' : 'opacity-50'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  style={{borderColor: 'rgb(235, 89, 56)'}}
                />
              </div>
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
  
    return (
      <div className="bg-[#141414] text-white p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* My Reads Card */}
          <div className="bg-[#1C1C1C] rounded-2xl p-6 flex flex-col justify-between col-span-1 row-span-2">
            <div>
              <h3 className="flex items-center text-xl font-bold mb-2">
                <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                My Reads
              </h3>
              <p className="text-gray-400 mb-4">Explore the books shaping my perspectives.</p>
            </div>
            <Image 
              src="https://placehold.co/400x600.png" 
              alt="Atomic Habits book cover" 
              width={400} 
              height={600} 
              className="w-full h-auto rounded-lg object-cover" 
              data-ai-hint="book cover" 
            />
          </div>
  
          {/* My Toolbox Card */}
          <div className="bg-[#1C1C1C] rounded-2xl p-6 col-span-1 lg:col-span-2">
            <h3 className="flex items-center text-xl font-bold mb-2">
              <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
              My Toolbox
            </h3>
            <p className="text-gray-400 mb-6">Explore the technologies and tools I use to create awesome digital experiences.</p>
            <div className="flex flex-wrap gap-4">
              {toolboxItems.map(item => (
                <div key={item.name} className="bg-[#2a2a2a] rounded-lg px-4 py-2 text-sm flex items-center">
                  {item.name}
                </div>
              ))}
            </div>
          </div>
  
          {/* My Hobbies Card */}
          <div className="bg-[#1C1C1C] rounded-2xl p-6 col-span-1 lg:col-span-2 relative overflow-hidden h-64 md:h-auto">
             <div className="relative z-10">
                <h3 className="flex items-center text-xl font-bold mb-2">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                    My Hobbies
                </h3>
                <p className="text-gray-400">Explore my interests, hobbies, and other things I enjoy doing beyond the digital realm.</p>
             </div>
             <Image 
                src="https://placehold.co/800x400.png"
                alt="Map of Dhaka"
                layout="fill"
                objectFit="cover"
                className="opacity-20 z-0"
                data-ai-hint="map Dhaka"
             />
          </div>
  
        </div>
      </div>
    );
  }

export default function Home() {
  return (
    <>
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://scontent.fdac138-1.fna.fbcdn.net/v/t39.30808-6/489643954_1207618031366053_6391368232504397889_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=bybr_YZJzsUQ7kNvwFkUVAN&_nc_oc=AdknBg_ukuAGHBLRTJ3Z23JbDfxZOAVYo6-Kh_2pziZc2q3gqRlUagLlkiogSv0V5dU&_nc_zt=23&_nc_ht=scontent.fdac138-1.fna&_nc_gid=Ep4pWuNIWrzdeH-MHntHnw&oh=00_AfR85qb8KAeVlYCXXzNw4eT8e7SX-_Hejf8RFCRoD84ZFA&oe=6892201F"
            alt="Minh Pham"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
            data-ai-hint="man portrait"
          />
        </div>
        <div className="relative z-10 text-center px-4" style={{ color: 'rgb(184, 172, 152)' }}>
          <p className="text-sm md:text-base tracking-[0.3em] mb-4">WELCOME TO PRANGON CENTRE</p>
          <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none tracking-tighter">
            smile <span style={{ color: 'rgb(235, 89, 56)' }}>for</span> miles
          </h1>
        </div>
      </div>
      <AboutMe />
      <SkillsSection />
      <WhatTheySaidSection />
      <InfoSection />
    </>
  );
}
