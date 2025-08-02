
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { BlogPostsTable } from '@/components/admin/blog-posts-table';
import Link from 'next/link';
import { getPosts } from './actions';

export default async function AdminBlogPage() {
    const posts = await getPosts();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Blog</h2>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/admin/blog/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Post
                        </Link>
                    </Button>
                </div>
            </div>
            <BlogPostsTable posts={posts} />
        </div>
    );
}
