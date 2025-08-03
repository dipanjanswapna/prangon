
import { getPrangonsLikhaPosts } from './actions';
import { PrangonsLikhaForm } from '@/components/admin/prangons-likha-form';
import { PrangonsLikhaPost } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { DeletePostButton } from '@/components/admin/prangons-likha-form';

export default async function AdminPrangonsLikhaPage() {
  const posts = await getPrangonsLikhaPosts();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manage "Prangons Likha"</h2>
                <p className="text-muted-foreground">
                Create, edit, or delete literary posts.
                </p>
            </div>
            {/* We will add a button here later to add a new post */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <PrangonsLikhaForm />
          </div>
          <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Existing Posts</CardTitle>
                    <CardDescription>View and manage all your current literary posts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <Card key={post.id} className="flex flex-col md:flex-row items-start gap-4 p-4">
                                <Image 
                                    src={post.coverImage}
                                    alt={post.title}
                                    width={150}
                                    height={100}
                                    className="rounded-md object-cover w-full md:w-[150px] h-auto"
                                    data-ai-hint={post.imageAiHint}
                                />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground">{post.author}</p>
                                    <Badge variant="secondary" className="mt-1">{post.category}</Badge>
                                </div>
                                <div className="flex-shrink-0 flex gap-2 self-start md:self-center">
                                    <PrangonsLikhaForm postToEdit={post} />
                                    <DeletePostButton id={post.id} />
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center">No posts found.</p>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
