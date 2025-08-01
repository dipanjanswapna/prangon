
'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  const skills = ["FORD", "UFC", "LINCOLN", "ROYAL CARIBBEAN", "SLEEPIQ", "NFL"];
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
    </>
  );
}
