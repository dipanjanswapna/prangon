
'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Post } from '@/lib/blog';
import { savePost } from '@/app/admin/blog/actions';
import { useToast } from '@/hooks/use-toast';

interface BlogPostFormProps {
    post?: Post;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Post' : 'Create Post')}
        </Button>
    );
}

export function BlogPostForm({ post }: BlogPostFormProps) {
    const { toast } = useToast();
    const isEditing = !!post;

    const handleSubmit = async (formData: FormData) => {
        await savePost(formData);
        toast({
            title: `Post ${post ? 'Updated' : 'Created'}!`,
            description: `The blog post "${formData.get('title')}" has been successfully saved.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{post ? 'Edit Post' : 'Create a new post'}</CardTitle>
                <CardDescription>Fill out the form below to {post ? 'update the' : 'add a new'} blog post.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-8">
                    {isEditing && <input type="hidden" name="slug" value={post.slug} />}
                    
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="Blog Post Title" defaultValue={post?.title} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="A brief description of the post" defaultValue={post?.description} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="coverImage">Cover Image URL</Label>
                        <Input id="coverImage" name="coverImage" placeholder="https://example.com/image.png" defaultValue={post?.coverImage} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input id="tags" name="tags" placeholder="EdTech, Design, Innovation" defaultValue={post?.tags.join(', ')} required />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="content">Content (HTML supported)</Label>
                        <Textarea id="content" name="content" placeholder="Write your post content here..." className="min-h-[300px]" defaultValue={post?.content} required />
                    </div>

                    <SubmitButton isEditing={isEditing} />
                </form>
            </CardContent>
        </Card>
    );
}
