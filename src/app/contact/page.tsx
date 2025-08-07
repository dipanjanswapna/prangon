'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Send, Linkedin, Instagram, Twitter, Facebook, Youtube, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

const socialPlatforms = [
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/dipanjanswapna/' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/dipanjanswapna' },
    { name: 'Behance', icon: Briefcase, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
]

export default function ContactPage() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Message Sent!',
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
    form.reset();
  }
  
    const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };


  return (
    <div className="relative min-h-screen py-8 md:py-12">
      <Image
        src="https://cdnb.artstation.com/p/assets/images/images/068/573/083/large/srabon-arafat-lost-in-space-1.jpg?1698155818"
        alt="Contact background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-20"
        data-ai-hint="space background"
      />
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card className="bg-background/80 backdrop-blur-sm border-border shadow-lg">
              <CardHeader className="text-center">
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-4xl font-bold font-headline text-primary-foreground">{t('contact_title')}</CardTitle>
                </motion.div>
                <motion.div variants={itemVariants}>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  {t('contact_description')}
                </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <motion.form 
                    variants={containerVariants}
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-6"
                  >
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact_name_label')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('contact_name_placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact_email_label')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('contact_email_placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact_message_label')}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t('contact_message_placeholder')}
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex justify-end">
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                        <Send className="mr-2 h-4 w-4" />
                        {t('contact_send_button')}
                      </Button>
                    </motion.div>
                  </motion.form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-12"
          >
              <Card className="bg-background/80 backdrop-blur-sm border-border shadow-lg">
                  <CardHeader>
                      <motion.div variants={itemVariants}>
                          <CardTitle className="text-2xl font-bold text-center font-headline text-primary-foreground">{t('contact_find_me_on')}</CardTitle>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                          <CardDescription className="text-center">
                              {t('contact_connect_with_me')}
                          </CardDescription>
                      </motion.div>
                  </CardHeader>
                  <CardContent>
                      <motion.div 
                          variants={containerVariants}
                          className="flex justify-center flex-wrap gap-4"
                      >
                          {socialPlatforms.map((platform, index) =>(
                              <motion.div key={platform.name} variants={itemVariants}>
                                  <Link href={platform.href} target="_blank" rel="noopener noreferrer">
                                      <Button variant="outline" size="icon" aria-label={platform.name}>
                                          <platform.icon className="h-5 w-5" />
                                      </Button>
                                  </Link>
                              </motion.div>
                          ))}
                      </motion.div>
                  </CardContent>
                  <CardFooter>
                      <motion.div variants={itemVariants} className="w-full">
                        <Button className="w-full" asChild>
                            <Link href="#">{t('contact_hire_me_button')}</Link>
                        </Button>
                      </motion.div>
                  </CardFooter>
              </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
