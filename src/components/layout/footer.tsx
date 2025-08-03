
'use client';

import { Github, Twitter, Linkedin, Copy, ExternalLink, Facebook, HandHeart, LogIn, LogOut, LayoutDashboard, Shield, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function Footer() {
  const { toast } = useToast();
  const [showSalute, setShowSalute] = useState(false);
  const { user } = useAuth();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('your-email@example.com');
    toast({
      title: 'Email Copied!',
      description: 'My email address has been copied to your clipboard.',
    });
  };

  const handleThankYouClick = () => {
    setShowSalute(true);
    setTimeout(() => setShowSalute(false), 2000);
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Linkedin', href: '#', icon: Linkedin },
    { name: 'Twitter', href: '#', icon: Twitter },
  ];

  const policyLinks = [
      {name: 'Privacy', href: '/privacy-policy'},
      {name: 'Terms', href: '/terms-of-service'},
      {name: 'Return Policy', href: '/return-policy'},
  ];

  return (
    <footer id="page-footer" className="relative bg-muted text-foreground pt-20 pb-8 overflow-hidden">
        <Image
            src="https://cdnb.artstation.com/p/assets/images/images/047/728/841/large/srabon-arafat-uploded-file.jpg?1648297353"
            alt="Footer background"
            fill
            className="absolute inset-0 z-0 object-cover opacity-10"
            data-ai-hint="abstract art"
        />
      <div className="relative z-10 container mx-auto px-4">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="relative p-8 md:p-12 mb-20"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-primary-foreground">
                Download My CV
              </h2>
              <p className="text-md md:text-lg text-muted-foreground">
                Interested in my profile? Get a detailed overview of my skills, experience, and projects by downloading my CV.
              </p>
            </div>
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg text-lg shadow-xl"
                >
                  <a href="/cv.pdf" download>
                    <Download className="mr-2 h-5 w-5" />
                    Download CV
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="border-t border-border pt-8">
             <div className="bg-background/20 backdrop-blur-sm border border-destructive/50 rounded-lg p-4 text-center mb-8">
                <div className="flex items-center justify-center gap-2">
                    <Shield className="h-5 w-5 text-destructive" />
                    <h3 className="font-bold text-destructive">Copyright & Warning</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                    এই ওয়েবসাইটের সমস্ত কনটেন্ট (লেখা, ছবি, বই) কপিরাইট দ্বারা সুরক্ষিত। অনুমতি ছাড়া কোনো কনটেন্ট নকল করা বা বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা আইনত দণ্ডনীয়। কোনো বই বা কনটেন্ট নকল করার চেষ্টা করলে অ্যাডমিন প্যানেল থেকে কঠোর ব্যবস্থা নেওয়া হবে এবং সরাসরি ১০,০০০ টাকা জরিমানা করা হবে।
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-muted-foreground">
                 <div className="text-sm text-center md:text-left">
                    &copy; {new Date().getFullYear()} All rights reserved by PRANGON CENTRE
                    <div className="flex justify-center md:justify-start items-center space-x-4 mt-2">
                        {policyLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="hover:text-primary transition-colors">{link.name}</Link>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center items-center space-x-4">
                     {user ? (
                      <>
                        <Link href="/admin/dashboard">
                           <Button variant="ghost" size="sm">
                             <LayoutDashboard className="mr-2 h-4 w-4" />
                             Dashboard
                           </Button>
                        </Link>
                        <Link href="/logout">
                          <Button variant="ghost" size="sm">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Link href="/login?flow=admin">
                         <Button variant="ghost" size="sm">
                           <LogIn className="mr-2 h-4 w-4" />
                          Admin Login
                        </Button>
                      </Link>
                    )}
                </div>

                <div className="flex justify-center md:justify-end items-center space-x-4 md:space-x-6">
                    {socialLinks.map((link, index) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={link.href} className="text-sm hover:text-primary transition-colors flex items-center gap-1">
                                <link.icon className="h-5 w-5"/>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 mt-8 text-center">
            <Link href="/">
                <Image src="/logo.png" alt="PRANGON CENTRE Logo" width={50} height={50} className="rounded-full" />
            </Link>
            <div className="relative">
                <p 
                    className="text-sm text-muted-foreground font-code font-bold cursor-pointer"
                    onClick={handleThankYouClick}
                >
                    Thank you for visiting Prangon Centre. Your support is a great motivation for my creative and humanitarian pursuits.
                </p>
                <AnimatePresence>
                {showSalute && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.5 }}
                        animate={{ opacity: 1, y: -40, scale: 1 }}
                        exit={{ opacity: 0, y: -60, scale: 0.5 }}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2"
                    >
                        <HandHeart className="h-8 w-8 text-primary" />
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </footer>
  );
}
