
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Undo2, FileText } from 'lucide-react';
import { FC } from 'react';

const policyContent = {
  title: 'Return and Refund Policy',
  lastUpdated: 'August 1, 2024',
  sections: [
    {
      title: 'Digital Products',
      content:
        'Due to the nature of digital products, including but not limited to e-books, PDF files, and premium content subscriptions, all sales are final. We do not offer returns or refunds for any digital products once the order is confirmed and the product is sent or access is granted.',
    },
    {
      title: 'Subscription Services',
      content:
        'Subscription fees are non-refundable. You may cancel your subscription at any time through your account settings. Upon cancellation, you will continue to have access to the service until the end of your current billing period. No partial or pro-rata refunds will be provided for cancellations made during a billing cycle.',
    },
    {
      title: 'Exceptional Circumstances',
      content:
        'In rare cases of technical issues where you are unable to access the purchased digital content, please contact our support team within 7 days of purchase. We will work with you to resolve the issue. If we are unable to provide you with access to the content, a refund may be considered at our sole discretion.',
    },
    {
      title: 'Contact Us',
      content:
        'If you have any questions about our Return and Refund Policy, please contact us through the contact form on our website. We are here to help and ensure you have a positive experience with PRANGON CENTRE.',
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

export default function ReturnPolicyPage() {
  return (
    <div className="relative bg-background min-h-screen py-16 md:py-24">
      <Image
        src="https://cdna.artstation.com/p/assets/images/images/061/000/222/large/srabon-arafat-meditation-of-sadness.jpg?1679796016"
        alt="Return policy background"
        fill
        className="absolute inset-0 z-0 object-cover opacity-10"
        data-ai-hint="abstract digital art"
      />
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-12">
          <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
            <Undo2 className="h-8 w-8 text-primary" />
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
