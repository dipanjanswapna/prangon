
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { posts } from '@/lib/blog';
import { Edit, Trash2 } from 'lucide-react';
import Link from "next/link";

export function BlogPostsTable() {
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
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
