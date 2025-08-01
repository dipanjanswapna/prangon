
'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

const AboutMe = () => {
    const text = "Hi! I’m Dipanjan “Swapna Prangon” Prangon from Dhaka, Bangladesh. As a passionate student, writer, and EdTech innovator, I founded Prangon’s Ecosystem to bridge creative design with education. I help students and educators through digital tools, branding, and movement-building learning content. With a keen eye for brand identity design, I craft logos, thumbnails, and visual stories that resonate.".split(' ');
    const [visibleWords, setVisibleWords] = useState<string[]>([]);
    const aboutRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleScroll = () => {
        if (aboutRef.current) {
          const { top, bottom } = aboutRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          if (top < windowHeight * 0.8 && bottom > windowHeight * 0.2) {
             const wordsToShow = [];
             for (let i = 0; i < text.length; i++) {
                setTimeout(() => {
                    setVisibleWords(prev => [...prev, text[i]]);
                }, i * 100);
             }
          }
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    const renderText = () => {
      const allWords = "Hi! I’m Dipanjan “Swapna Prangon” Prangon from Dhaka, Bangladesh. As a passionate student, writer, and EdTech innovator, I founded Prangon’s Ecosystem to bridge creative design with education. I help students and educators through digital tools, branding, and movement-building learning content. With a keen eye for brand identity design, I craft logos, thumbnails, and visual stories that resonate.".split(' ');
      let wordIndex = 0;
  
      return allWords.map((word, index) => {
          const isVisible = visibleWords.includes(word) && index <= visibleWords.lastIndexOf(word);
          
          return (
              <span key={index} className="inline-block">
                <span style={{
                    color: 'rgb(184, 172, 152)',
                    transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
                    opacity: isVisible ? 1 : 0.1,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    display: 'inline-block'
                }}>
                    {word}
                </span>
                {' '}
              </span>
          );
      });
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
    </>
  );
}
