'use client';

import { Github, Twitter, Linkedin, Copy, ExternalLink, Facebook } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function Footer() {
  const { toast } = useToast();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('your-email@example.com');
    toast({
      title: 'Email Copied!',
      description: 'My email address has been copied to your clipboard.',
    });
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Linkedin', href: '#', icon: Linkedin },
    { name: 'Twitter', href: '#', icon: Twitter },
  ];

  return (
    <footer className="relative bg-muted text-foreground pt-20 pb-8 overflow-hidden">
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
            className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 md:p-12 mb-20 shadow-lg text-white"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Let's create something amazing together
              </h2>
              <p className="text-md md:text-lg opacity-80">
                Ready to bring your next project to life? Let's connect and discuss how I can help you achieve your goals.
              </p>
            </div>
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.3)"}}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleCopyEmail}
                  className="bg-white/90 hover:bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg text-lg shadow-xl"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy Email
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-muted-foreground">
                <p className="text-sm mb-4 md:mb-0 text-center md:text-left">
                    &copy; {new Date().getFullYear()} All rights reserved by PRANGON CENTRE
                </p>
                <div className="flex items-center space-x-4 md:space-x-6">
                    {socialLinks.map((link, index) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={link.href} className="text-sm hover:text-primary transition-colors flex items-center gap-1">
                                {link.name} <ExternalLink size={14} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
