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
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md"
        >
            <div className="bg-gray-800/80 backdrop-blur-lg text-white rounded-lg p-4 shadow-2xl flex items-center gap-4">
                <Image src="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg" alt="Tashdid Bin" width={50} height={50} className="rounded-full" />
                <div className="flex-grow">
                    <h4 className="font-bold">Tashdid Bin is available for hire</h4>
                    <p className="text-sm text-gray-300">Availability: Over a month</p>
                </div>
                <Button variant="secondary" size="sm" asChild>
                    <Link href="/contact">Hire Tashdid Bin</Link>
                </Button>
                <button onClick={handleClose} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                </button>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
