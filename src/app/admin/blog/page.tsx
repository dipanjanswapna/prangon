
import { getBlogPosts } from './actions';
import { BlogForm, DeletePostButton } from '@/components/admin/blog-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manage Blog</h2>
                <p className="text-muted-foreground">
                Add, edit, or delete blog posts.
                </p>
            </div>
            <BlogForm />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Existing Blog Posts</CardTitle>
                <CardDescription>View and manage all your current blog posts.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cover</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {posts.length > 0 ? (
                            posts.map(post => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <Image 
                                            src={post.coverImage}
                                            alt={post.title}
                                            width={60}
                                            height={40}
                                            className="rounded-sm object-cover"
                                            data-ai-hint={post.imageAiHint}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>{post.author}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{post.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {post.isFeatured && <Badge>Featured</Badge>}
                                            {post.isPremium && <Badge variant="destructive" className="gap-1"><Star className="h-3 w-3"/>Premium</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <BlogForm postToEdit={post} />
                                            <DeletePostButton id={post.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                         ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">No posts found.</TableCell>
                            </TableRow>
                         )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
