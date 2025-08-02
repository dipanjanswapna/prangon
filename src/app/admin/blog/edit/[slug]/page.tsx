
import { BlogPostForm } from '@/components/admin/blog-post-form';
import { getPostBySlug } from '@/app/admin/blog/actions';
import { notFound } from 'next/navigation';

export default async function EditBlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Post</h2>
            </div>
            <BlogPostForm post={post} />
        </div>
    );
}
