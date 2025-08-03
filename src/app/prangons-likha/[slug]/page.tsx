
import { getPrangonsLikhaPosts } from '@/app/admin/prangons-likha/actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Tag, Star, Lock } from 'lucide-react';
import { SocialShareButtons } from '@/components/social-share-buttons';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export async function generateStaticParams() {
  const posts = await getPrangonsLikhaPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function PrangonsLikhaPostPage({ params }: { params: { slug: string } }) {
  const posts = await getPrangonsLikhaPosts();
  const post = posts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative bg-background min-h-screen py-16 md:py-24">
       <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="absolute inset-0 z-0 object-cover opacity-10"
          data-ai-hint={post.imageAiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0"/>

      <div className="relative z-10 container mx-auto px-4">
        <article className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <div className="flex justify-center gap-2 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                {post.isPremium && <Badge variant="destructive" className="gap-1"><Star className="h-3 w-3" /> Premium</Badge>}
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-primary-foreground uppercase mb-4">
              {post.title}
            </h1>
            <div className="flex justify-center items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://assets.about.me/users/d/i/p/dipanjanswapna_1738842981_721.jpg" alt={post.author} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{post.author}</span>
                </div>
            </div>
          </header>
          
          {post.isPremium ? (
             <Card className="bg-muted/30 border-primary/20 text-center p-8">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary w-fit p-3 rounded-full mb-4">
                        <Lock className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-primary-foreground">This is a Premium Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">
                        To continue reading this exclusive content, please subscribe to our premium plan. Unlock all premium articles and support our work.
                    </p>
                    <Link href="/subscribe">
                        <Button size="lg">Subscribe Now</Button>
                    </Link>
                </CardContent>
            </Card>
          ) : (
            <>
                <div className="prose prose-invert prose-lg max-w-none mx-auto leading-relaxed whitespace-pre-line text-foreground/90">
                    {post.content}
                </div>

                <footer className="mt-12 pt-8 border-t border-border/20">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        {post.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                    </div>
                    <SocialShareButtons postTitle={post.title} />
                    </div>
                </footer>
            </>
          )}

        </article>
      </div>
    </div>
  );
}
