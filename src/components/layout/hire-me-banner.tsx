'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const HireMeBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const footer = document.getElementById('page-footer');
      const showBanner = window.scrollY > 500;
      let hideBanner = false;

      if (footer) {
        const footerTop = footer.offsetTop;
        const scrollBottom = window.scrollY + window.innerHeight;
        // Start hiding 100px before the footer comes into view
        if (scrollBottom > footerTop - 100) {
          hideBanner = true;
        }
      }

      if (showBanner && !hideBanner) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    // Initial check in case the page loads scrolled down
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const handleClose = () => {
      setIsClosed(true);
  }

  if (isClosed) {
      return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-4 left-0 right-0 z-[100] px-4"
        >
            <div className="mx-auto max-w-2xl">
                <div className="bg-primary/80 backdrop-blur-md text-primary-foreground rounded-lg p-2 shadow-2xl flex items-center gap-2 sm:gap-4">
                    <Image src="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg" alt="Dipanjan Prangon" width={40} height={40} className="rounded-full w-8 h-8 sm:w-10 sm:h-10" />
                    <div className="flex-grow">
                        <h4 className="font-bold text-sm sm:text-base">Dipanjan Prangon is available for hire</h4>
                        <p className="text-xs sm:text-sm text-primary-foreground/80">Availability: Over a month</p>
                    </div>
                     <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0"
                      >
                        <Link href="/contact" className="relative block w-28 sm:w-32 h-8 sm:h-10">
                          <Image
                            src="https://cbx-prod.b-cdn.net/COLOURBOX52382970.jpg?width=800&height=800&quality=70"
                            alt="Hire me button image"
                            layout="fill"
                            className="rounded-md object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                            <span className="font-bold text-yellow-400 text-sm" style={{ textShadow: '1px 1px 2px black' }}>Hire Dipanjan</span>
                          </div>
                        </Link>
                      </motion.div>
                    <button onClick={handleClose} className="text-primary-foreground/80 hover:text-primary-foreground p-1 rounded-full self-start sm:self-center">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
