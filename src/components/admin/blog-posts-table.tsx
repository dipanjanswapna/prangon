
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Post } from '@/lib/blog';
import { Edit, Trash2 } from 'lucide-react';
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { deletePost } from '@/app/admin/blog/actions';

function DeletePostButton({ slug }: { slug: string }) {
    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            await deletePost(slug);
            toast({
                title: "Post Deleted",
                description: "The blog post has been successfully deleted.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete the post. Please try again.",
            });
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this post
                        from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function BlogPostsTable({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 border rounded-md">
        <p className="text-muted-foreground">No blog posts found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.slug}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="icon">
                <Link href={`/admin/blog/edit/${post.slug}`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <DeletePostButton slug={post.slug} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
