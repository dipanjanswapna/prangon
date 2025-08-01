
'use client';

import { Github, Twitter, Linkedin, Copy, ExternalLink, Facebook } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

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
    <footer className="bg-[#141414] text-white pt-20 pb-8 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Call to Action Section */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 mb-20 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Let's create something amazing together
              </h2>
              <p className="text-md md:text-lg text-white/80">
                Ready to bring your next project to life? Let's connect and discuss how I can help you achieve your goals.
              </p>
            </div>
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleCopyEmail}
                  className="bg-slate-900/70 hover:bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg text-lg"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy Email
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
                <p className="text-sm mb-4 md:mb-0 text-center md:text-left">
                    &copy; {new Date().getFullYear()} All rights reserved
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
                            <Link href={link.href} className="text-sm hover:text-white transition-colors flex items-center gap-1">
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
