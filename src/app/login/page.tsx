
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.588,44,30.168,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

const images = {
    login: {
        src: "https://i.pinimg.com/1200x/af/5e/13/af5e1320015a3672ea231c203ca45ee4.jpg",
        alt: "Login illustration",
        aiHint: "fantasy character"
    },
    signup: {
        src: "https://i.pinimg.com/1200x/a9/d8/46/a9d846d03604c81f09ec1p49914df77f.jpg",
        alt: "Signup illustration",
        aiHint: "fantasy landscape"
    }
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function LoginPage() {
  const { toast } = useToast();
  const { login, signup, loginWithGoogle, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });
  
  // This effect checks for the 'flow=admin' param and sets the state.
  // It's important for handling redirects after Google login.
  useEffect(() => {
    if (searchParams.get('flow') === 'admin') {
      setIsAdminLogin(true);
    }
  }, [searchParams]);

  // This effect handles redirecting the user once they are authenticated.
  useEffect(() => {
    if (loading) {
      // Do nothing while auth state is loading to prevent premature redirects.
      return;
    }
    
    if (user) {
      if (isAdminLogin) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          // If a non-admin tries the admin flow, show an error and send them home.
          toast({ variant: 'destructive', title: 'Access Denied', description: 'You do not have permission to access the admin panel.' });
          router.push('/');
        }
      } else {
        // Default redirect for regular users.
        router.push('/account');
      }
    }
  }, [user, loading, router, isAdminLogin, toast]);

  async function onLogin(values: z.infer<typeof loginSchema>) {
    try {
      await login(values.email, values.password);
      toast({ title: 'Login Successful!', description: "Welcome back!" });
      // The useEffect above will handle redirection.
    } catch (error) {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
    }
  }

  async function onSignup(values: z.infer<typeof signupSchema>) {
    try {
      await signup(values.email, values.password, values.name);
      toast({ title: 'Signup Successful!', description: "Welcome to the community!" });
       // The useEffect above will handle redirection.
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: error.message });
    }
  }

  async function handleGoogleLogin() {
    try {
      await loginWithGoogle();
      toast({ title: 'Login Successful!', description: "Welcome!" });
       // The useEffect above will handle redirection.
    } catch (error) {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Could not log in with Google.' });
    }
  }
  
  const currentImage = images[activeTab as keyof typeof images];
  
  const isProcessing = loginForm.formState.isSubmitting || signupForm.formState.isSubmitting || loading;

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 lg:p-8 bg-background">
      { isProcessing && 
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
      <div className="absolute inset-0 z-0">
          <Image
              src={currentImage.src}
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="opacity-30 transition-all duration-1000"
              data-ai-hint={currentImage.aiHint}
              key={activeTab}
          />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <Card className="grid lg:grid-cols-2 overflow-hidden shadow-2xl border-border/20 bg-card/80">
             <AnimatePresence>
                 <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === 'login' ? -100 : 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === 'login' ? -100 : 100 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className={cn(
                        "hidden lg:block relative",
                        activeTab === 'signup' && "lg:order-last"
                    )}
                 >
                    <Image
                        src={currentImage.src}
                        alt={currentImage.alt}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={currentImage.aiHint}
                    />
                </motion.div>
             </AnimatePresence>
            <div className="p-6 sm:p-8">
                <CardHeader className="text-center p-0 mb-6">
                    <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
                    <CardDescription>{isAdminLogin ? "Admin Panel Access" : "Login or create an account to continue"}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login"><LogIn className="mr-2 h-4 w-4"/>Login</TabsTrigger>
                        <TabsTrigger value="signup"><UserPlus className="mr-2 h-4 w-4"/>Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <motion.div 
                            key="login-form"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="py-4 space-y-4"
                        >
                            <motion.div variants={itemVariants}>
                                <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isProcessing}>
                                    <GoogleIcon className="mr-2 h-5 w-5" /> Continue with Google
                                </Button>
                            </motion.div>
                            <motion.div variants={itemVariants} className="relative">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </motion.div>
                            <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                <motion.div variants={itemVariants}>
                                    <FormField control={loginForm.control} name="email" render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input type="email" placeholder="you@example.com" {...field} disabled={isProcessing} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )} />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField control={loginForm.control} name="password" render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl><Input type="password" placeholder="••••••••" {...field} disabled={isProcessing} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )} />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Button type="submit" className="w-full" disabled={isProcessing}>
                                        {loginForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
                                    </Button>
                                </motion.div>
                                </form>
                            </Form>
                        </motion.div>
                    </TabsContent>
                    <TabsContent value="signup">
                       <motion.div 
                            key="signup-form"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="py-4 space-y-4"
                        >
                            <motion.div variants={itemVariants}>
                                <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isProcessing}>
                                    <GoogleIcon className="mr-2 h-5 w-5" /> Sign up with Google
                                </Button>
                            </motion.div>
                            <motion.div variants={itemVariants} className="relative">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or sign up with email</span>
                                </div>
                            </motion.div>
                            <Form {...signupForm}>
                                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                                <motion.div variants={itemVariants}>
                                    <FormField control={signupForm.control} name="name" render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl><Input placeholder="Your Name" {...field} disabled={isProcessing}/></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )} />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField control={signupForm.control} name="email" render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input type="email" placeholder="you@example.com" {...field} disabled={isProcessing} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )} />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <FormField control={signupForm.control} name="password" render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl><Input type="password" placeholder="••••••••" {...field} disabled={isProcessing} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )} />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Button type="submit" className="w-full" disabled={isProcessing}>
                                        {signupForm.formState.isSubmitting ? 'Creating account...' : 'Create Account'}
                                    </Button>
                                </motion.div>
                                </form>
                            </Form>
                        </motion.div>
                    </TabsContent>
                    </Tabs>
                </CardContent>
            </div>
        </Card>
      </motion.div>
    </div>
  );
}
