
'use client';

import { getPostBySlug } from '@/app/admin/blog/actions';
import { Post } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

const SocialShare = ({ postUrl, postTitle }: { postUrl: string, postTitle: string}) => {
    if (!postUrl) return null;

    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(postTitle);

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Share:</span>
            <Button variant="outline" size="icon" asChild>
                <Link href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank">
                    <Twitter className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
                 <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank">
                    <Linkedin className="h-4 w-4" />
                </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank">
                    <Facebook className="h-4 w-4" />
                </Link>
            </Button>
        </div>
    )
}

const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto">
    <div className="mb-8">
      <Skeleton className="h-6 w-32" />
    </div>
    <main>
      <article>
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-8 w-3/4" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </header>
        <Card className="bg-muted/20 backdrop-blur-sm">
          <CardContent className="p-0">
            <Skeleton className="w-full h-[400px] rounded-t-lg" />
            <div className="p-6 md:p-8 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </article>
    </main>
  </div>
);

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [postUrl, setPostUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const fetchedPost = await getPostBySlug(params.slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch post", error);
        // Handle error state if necessary
      } finally {
        setLoading(false);
      }
    }
    fetchPost();

    if (typeof window !== 'undefined') {
      setPostUrl(window.location.href);
    }
  }, [params.slug]);


  if (loading) {
    return (
      <div className="relative min-h-screen py-8 md:py-12 bg-background">
        <div className="relative z-10 container mx-auto px-4">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!post) {
    // This will be handled by notFound() in useEffect, but as a fallback
    return notFound();
  }

  return (
    <div className="relative min-h-screen py-8 md:py-12 bg-background">
       <Image
          src={post.coverImage}
          alt={`${post.title} cover image`}
          fill
          className="absolute inset-0 z-0 object-cover opacity-10"
          data-ai-hint="abstract blog background"
        />
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
                </Link>
            </div>

            <main>
                <article>
                <header className="mb-8">
                     <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                     </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-headline text-primary-foreground">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={post.author.imageUrl} alt={post.author.name} />
                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={new Date(post.date).toISOString()}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                        </div>
                    </div>
                </header>

                <Card className="bg-muted/20 backdrop-blur-sm">
                    <CardContent className="p-0">
                        <Image
                            src={post.coverImage}
                            alt={`${post.title} main image`}
                            width={1200}
                            height={600}
                            data-ai-hint="blog post image"
                            className="w-full h-auto object-cover rounded-t-lg"
                        />
                         <div className="prose prose-lg dark:prose-invert max-w-none p-6 md:p-8">
                            <p className="lead text-xl text-muted-foreground">{post.description}</p>
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                    </CardContent>
                </Card>
               
                <footer className="mt-8">
                    <Card className="bg-muted/20 backdrop-blur-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-semibold">Tags:</span>
                             {post.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                        </div>
                       <SocialShare postUrl={postUrl} postTitle={post.title} />
                    </Card>
                </footer>
                </article>
            </main>
        </div>
      </div>
    </div>
  );
}
