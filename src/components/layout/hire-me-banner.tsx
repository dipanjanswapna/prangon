
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
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

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
            className="fixed bottom-4 left-0 right-0 z-[100]"
        >
            <div className="mx-auto max-w-lg">
                <div className="bg-primary/80 backdrop-blur-sm text-primary-foreground rounded-lg p-2 shadow-2xl flex items-center gap-4">
                    <Image src="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg" alt="Dipanjan Prangon" width={40} height={40} className="rounded-full" />
                    <div className="flex-grow">
                        <h4 className="font-bold">Dipanjan Prangon is available for hire</h4>
                        <p className="text-sm text-primary-foreground/80">Availability: Over a month</p>
                    </div>
                    <Button variant="secondary" size="sm" asChild>
                        <Link href="/contact">Hire Dipanjan</Link>
                    </Button>
                    <button onClick={handleClose} className="text-primary-foreground/80 hover:text-primary-foreground p-1 rounded-full">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
