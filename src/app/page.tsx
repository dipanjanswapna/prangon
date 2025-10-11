
'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, animate } from 'framer-motion';
import { Youtube, Sparkles, ChevronsRight, Loader2, Heart, Briefcase, BookCopy, Star, Ghost, Check, Crown, HelpCircle, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getHomePageContent } from './admin/home/actions';
import { HomePageData, LibraryItem, PrangonsLikhaPost, SubscriptionPlan, FAQItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getLibraryItems } from './library/actions';
import { getPrangonsLikhaPosts } from './admin/prangons-likha/actions';
import { getSubscriptionPlans } from './admin/subscriptions/actions';
import { getFAQPageData } from './admin/faq/actions';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


const TypingAnimation = ({ texts }: { texts: string[] }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const delay = 2000;

  useEffect(() => {
    if (texts.length === 0) return;

    const handleTyping = () => {
      const currentText = texts[textIndex];
      const updatedText = isDeleting
        ? currentText.substring(0, typedText.length - 1)
        : currentText.substring(0, typedText.length + 1);
      
      setTypedText(updatedText);

      if (!isDeleting && updatedText === currentText) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }
    };
    
    const typingTimeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    
    return () => clearTimeout(typingTimeout);
  }, [typedText, isDeleting, texts, textIndex]);

  return (
    <div className="mt-4 h-8">
       <p className="typing-text">{typedText}&nbsp;</p>
    </div>
  );
};


const AboutMe = ({ text, imageUrl, backgroundUrl } : { text: string, imageUrl: string, backgroundUrl: string }) => {
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
    <div ref={aboutRef} className="relative">
        <Image
          src={backgroundUrl}
          alt="About Me background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-30"
          data-ai-hint="dark interior background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-0"/>
        <div className="relative bg-transparent flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-32 pb-16 sm:pb-24">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto">
              <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8 }}
                  className="w-full md:w-2/5 flex justify-center relative order-1 md:order-2"
              >
                  <Image
                      src={imageUrl}
                      alt="Dipanjan Prangon"
                      width={400}
                      height={500}
                      className="object-contain w-[300px] h-[400px] sm:w-[400px] sm:h-[500px]"
                      data-ai-hint="profile picture"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
              </motion.div>
              <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8 }}
                  className="w-full md:w-3/5 order-2 md:order-1"
              >
                  <p className="text-sm tracking-[0.3em] mb-6 text-muted-foreground uppercase">About Me</p>
                  <motion.h2 
                      className="font-sans text-lg md:text-xl font-normal leading-relaxed text-left max-w-2xl text-primary-foreground/80"
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
          </div>
      </div>
    </div>
  );
};

const SkillsSection = ({ skills }: { skills: string[] }) => {
    return (
        <div className="bg-background py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 divide-y divide-border">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="py-4 md:py-6"
                        >
                            <h3 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-primary-foreground/80 hover:text-primary transition-colors duration-300">
                                {skill}
                            </h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function AnimatedCounter({ to, suffix }: { to: number, suffix?: string }) {
    const nodeRef = useRef<HTMLParagraphElement>(null);
  
    useEffect(() => {
      const node = nodeRef.current;
      if (!node) return;
  
      const controls = animate(0, to, {
        duration: 2,
        onUpdate(value) {
          node.textContent = Math.round(value).toString() + (suffix || '');
        },
      });
  
      return () => controls.stop();
    }, [to, suffix]);
  
    return <p ref={nodeRef} className="text-4xl font-extrabold text-white" />;
  }

const StatsSection = ({ happyCustomers, servicesProvided }: { happyCustomers: number, servicesProvided: number }) => {
    const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
    const [prangonLikhaItems, setPrangonLikhaItems] = useState<PrangonsLikhaPost[]>([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lib, likha, plans] = await Promise.all([
                    getLibraryItems(),
                    getPrangonsLikhaPosts(),
                    getSubscriptionPlans(),
                ]);
                setLibraryItems(lib);
                setPrangonLikhaItems(likha);
                setSubscriptionPlans(plans);
            } catch (error) {
                console.error("Failed to fetch stats data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalWritings = libraryItems.length + prangonLikhaItems.length;

    const stats = [
        { name: 'Happy Customers', value: happyCustomers, suffix: '+', icon: <Heart className="h-6 w-6 text-red-400" />, href: null },
        { name: 'Services Provided', value: servicesProvided, suffix: '+', icon: <Briefcase className="h-6 w-6 text-blue-400" />, href: null },
        { name: 'Books & Writings', value: loading ? 0 : totalWritings, suffix: '+', icon: <BookCopy className="h-6 w-6 text-green-400" />, href: null },
        { name: 'Subscription Packages', value: loading ? 0 : subscriptionPlans.length, suffix: '+', icon: <Star className="h-6 w-6 text-yellow-400" />, href: '/subscribe' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };

    return (
        <div className="relative py-16 sm:py-24 overflow-hidden">
            <Image
                src="https://i.postimg.cc/cHnJWq6b/abstract-flowing-neon-wave-background-53876-101942.avif"
                alt="Stats background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-50"
                data-ai-hint="abstract neon wave"
            />
            <div className="absolute inset-0 bg-background/50 z-0" />
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    {stats.map((stat, index) => {
                        const StatCardContent = (
                            <motion.div key={stat.name} variants={itemVariants} className="liquid-card h-full">
                                <div className="p-4 sm:p-6 text-center flex flex-col items-center justify-center h-full">
                                    <div className="mb-2">
                                        {stat.icon}
                                    </div>
                                    <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                                    <p className="text-white/80 text-xs sm:text-sm mt-1">{stat.name}</p>
                                </div>
                            </motion.div>
                        );

                        if (stat.href) {
                            return <Link href={stat.href} key={stat.name} className="block h-full">{StatCardContent}</Link>;
                        }
                        return StatCardContent;
                    })}
                </motion.div>
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
                data-ai-hint={testimonial.imageAiHint || 'person'}
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
  
const UpcomingEventsSection = ({ data }: { data: HomePageData['upcomingEvents'] }) => {
  if (!data) {
    return null;
  }
  return (
    <div className="relative py-20 sm:py-32">
      <Image 
        src={data.backgroundImageUrl}
        alt="Upcoming events background"
        layout="fill"
        className="object-cover"
        data-ai-hint="audience event"
      />
       <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
            <CalendarDays className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary-foreground mb-4" style={{ fontFamily: 'cursive' }}>
            {data.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {data.description}
          </p>
          <Link href={data.buttonLink}>
            <Button size="lg">{data.buttonText}</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const LatestVideosSection = ({ videos }: { videos: any[] }) => {
    const plugin = useRef(
      Autoplay({ delay: 5000, stopOnInteraction: true })
    );

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
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.2 }}
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
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.4 }}
          >
             <Carousel
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {videos.map((video, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <div 
                        className="bg-muted rounded-lg overflow-hidden group shadow-lg"
                      >
                        <div className="relative">
                          <Image 
                            src={video.thumbnail} 
                            alt={video.title}
                            width={400} 
                            height={225} 
                            className="w-full h-auto"
                            data-ai-hint={video.thumbnailAiHint || 'video thumbnail'}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Youtube className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-base sm:text-lg mb-2 text-primary-foreground">{video.title}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">{video.author} · {video.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-[-1rem] sm:left-[-2rem]"/>
              <CarouselNext className="right-[-1rem] sm:right-[-2rem]"/>
            </Carousel>
          </motion.div>

  
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
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

const SubscriptionSection = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    useEffect(() => {
        getSubscriptionPlans()
            .then(data => setPlans(data))
            .finally(() => setLoading(false));
    }, []);

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <div ref={containerRef} className="relative bg-background text-foreground py-20 sm:py-32 overflow-hidden">
            <motion.div className="absolute inset-0 z-0">
                <Image
                    src="https://i.pinimg.com/1200x/5d/4c/cf/5d4ccf1e420b6111429f7526ea2369ec.jpg"
                    alt="Subscription background"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-70"
                    data-ai-hint="fantasy landscape night"
                />
            </motion.div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary-foreground mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                        Unlock Premium Access
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
                        Join our community and get exclusive access to premium content, special features, and more.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {plans.map((plan, index) => {
                            const y = index === 0 ? y1 : y2;
                            return (
                                <motion.div 
                                    key={plan.id} 
                                    style={{ y }}
                                    whileHover={{ y: y.get() -10, scale: 1.03, rotate: index % 2 === 0 ? -1 : 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15}}
                                >
                                    <Card className={cn(
                                        "bg-background/20 backdrop-blur-md border-border/20 flex flex-col h-full shadow-2xl transition-all duration-300 hover:border-primary",
                                        plan.isPopular && "border-primary"
                                    )}>
                                        {plan.isPopular && (
                                            <div className="bg-primary text-primary-foreground text-center py-1.5 px-4 text-sm font-bold rounded-t-lg flex items-center justify-center gap-1">
                                                <Star className="h-4 w-4" /> Most Popular
                                            </div>
                                        )}
                                        <CardHeader className="text-center">
                                            <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                                            <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <div className="text-center mb-6">
                                                <span className="text-5xl font-extrabold text-primary-foreground">
                                                    ${plan.priceMonthly}
                                                </span>
                                                <span className="text-muted-foreground">/month</span>
                                            </div>
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" asChild size="lg">
                                                <Link href={`/subscribe?planId=${plan.id}&billing=monthly`}>
                                                    Choose Plan
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [faqData, setFaqData] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFAQPageData()
            .then(data => setFaqData(data.faqs))
            .finally(() => setLoading(false));
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    };

    return (
        <div className="relative bg-background text-foreground py-20 sm:py-32 overflow-hidden">
            <motion.div className="absolute inset-0 z-0">
                 <Image
                    src="https://i.pinimg.com/1200x/08/f1/91/08f191ca9538e01c4ee25010718b0b38.jpg"
                    alt="FAQ background"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-30"
                    data-ai-hint="mystical forest night"
                />
                 <div className="absolute inset-0 bg-background/40" />
            </motion.div>
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                     <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
                        <HelpCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold font-headline text-primary-foreground mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqData.map((faq, index) => (
                                <motion.div key={faq.id} variants={itemVariants}>
                                    <AccordionItem value={`item-${index}`} className="bg-muted/30 border border-border/20 rounded-lg backdrop-blur-sm">
                                        <AccordionTrigger className="p-6 text-lg font-semibold text-left hover:no-underline">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6 text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                </motion.div>
                            ))}
                        </Accordion>
                    </motion.div>
                )}
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
            alt="Hero background"
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
             <span
                key={index}
                className={cn(
                    "inline-block",
                    word.toUpperCase() === "SWAPNA" && "text-red-500"
                )}
             >
                {word.split("").map((char, charIndex) => (
                    <motion.span key={charIndex} variants={titleItem} className="inline-block">
                        {char}
                    </motion.span>
                ))}
                {index < titleWords.length -1 && <span>&nbsp;</span>}
            </span>
           ))}
          </motion.h1>
          <TypingAnimation texts={content.heroAnimatedTexts} />
        </div>
      </div>
      <AboutMe 
        text={content.aboutMeText} 
        imageUrl={content.aboutMeImageUrl} 
        backgroundUrl={content.aboutMeBackgroundUrl}
      />
      <StatsSection happyCustomers={content.stats.happyCustomers} servicesProvided={content.stats.servicesProvided} />
      <SkillsSection skills={content.skills} />
      <WhatTheySaidSection testimonials={content.testimonials}/>
      {content.upcomingEvents && <UpcomingEventsSection data={content.upcomingEvents} />}
      <LatestVideosSection videos={content.videos} />
      <SubscriptionSection />
      <FAQSection />
    </>
  );
}
