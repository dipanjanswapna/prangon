
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FileSignature, FileText } from 'lucide-react';
import { FC } from 'react';

const policyContent = {
  title: 'Terms of Service',
  lastUpdated: 'August 1, 2024',
  sections: [
    {
      title: '1. Acceptance of Terms',
      content:
        'By accessing and using the PRANGON CENTRE website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website\'s particular services, you shall be subject to any posted guidelines or rules applicable to such services.',
    },
    {
      title: '2. Intellectual Property',
      content:
        'All content on this site, including text, graphics, logos, and digital downloads, is the property of PRANGON CENTRE and is protected by international copyright laws. Unauthorized use, reproduction, or distribution of any content is strictly prohibited and will result in legal action, including a direct penalty of 10,000 BDT as mentioned in our copyright notice.',
    },
    {
      title: '3. User Conduct',
      content:
        'You agree not to use the website in any way that is unlawful, or harms PRANGON CENTRE, its service providers, its suppliers, its affiliates, or any other user. You are prohibited from attempting to gain unauthorized access to any part of the website or its related systems or networks.',
    },
    {
      title: '4. Subscription and Payment',
      content:
        'For services that require payment, you agree to provide current, complete, and accurate purchase and account information. You agree to promptly update your account and other information, including your email address and payment method details, so that we can complete your transactions and contact you as needed.',
    },
    {
      title: '5. Disclaimer of Warranties',
      content:
        'The website and its content are provided "as is" and "as available" without any warranties of any kind, including that the website will operate error-free or that the website, its servers, or its content are free of computer viruses or similar contamination or destructive features.',
    },
  ],
};

const WordByWordAnimation: FC<{ text: string }> = ({ text }) => {
  const words = text.split(' ');
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };
  const child = {
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 20, transition: { type: 'spring', damping: 12, stiffness: 100 } },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="text-muted-foreground leading-relaxed"
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="inline-block mr-[0.2em]">
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default function TermsOfServicePage() {
  return (
    <div className="relative bg-background min-h-screen py-16 md:py-24">
      <Image
        src="https://cdna.artstation.com/p/assets/images/images/061/000/222/large/srabon-arafat-meditation-of-sadness.jpg?1679796016"
        alt="Terms background"
        fill
        className="absolute inset-0 z-0 object-cover opacity-15"
        data-ai-hint="abstract digital art"
      />
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-12">
          <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
            <FileSignature className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-primary-foreground uppercase">
            {policyContent.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {policyContent.lastUpdated}
          </p>
        </header>

        <div className="space-y-8">
          {policyContent.sections.map((section, index) => (
            <section key={index}>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-2xl font-bold font-headline text-primary-foreground mb-4 flex items-center gap-2"
              >
                <FileText className="h-5 w-5 text-primary"/>
                {section.title}
              </motion.h2>
              <WordByWordAnimation text={section.content} />
            </section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5, type: 'spring' }}
          className="mt-16 flex justify-end"
        >
          <div className="relative w-36 h-36">
            <Image src="/stamp.png" alt="Official Stamp" layout="fill" data-ai-hint="official stamp"/>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
