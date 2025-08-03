
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addBlogPost, updateBlogPost, deleteBlogPost } from '@/app/admin/blog/actions';
import { blogPostSchema, BlogPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle, Loader2, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from 'react';

type FormValues = Omit<BlogPost, 'id' | 'slug'>;

export function BlogForm({ postToEdit }: { postToEdit?: BlogPost }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues: FormValues = {
    title: postToEdit?.title || '',
    author: postToEdit?.author || '',
    category: postToEdit?.category || '',
    date: postToEdit?.date || new Date().toISOString().split('T')[0],
    coverImage: postToEdit?.coverImage || 'https://placehold.co/800x400.png',
    imageAiHint: postToEdit?.imageAiHint || 'blog post cover',
    content: postToEdit?.content || '',
    tags: postToEdit?.tags || [],
    isFeatured: postToEdit?.isFeatured || false,
    isPremium: postToEdit?.isPremium || false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(blogPostSchema.omit({id: true, slug: true})),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const onSubmit = async (data: FormValues) => {
    const result = postToEdit 
      ? await updateBlogPost(postToEdit.id, data)
      : await addBlogPost(data);
      
    if (result.success) {
      toast({ title: 'Success', description: `Post ${postToEdit ? 'updated' : 'added'} successfully.` });
      form.reset(defaultValues);
      setIsOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save post.',
      });
      console.error(result.error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
            {postToEdit ? (
                <Button variant="outline" size="icon"><Edit className="h-4 w-4"/></Button>
            ) : (
                <Button><PlusCircle className="mr-2 h-4 w-4"/> Add New Post</Button>
            )}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-background p-6 rounded-lg shadow-lg overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-2xl font-bold">{postToEdit ? 'Edit Post' : 'Add New Post'}</Dialog.Title>
                    <Dialog.Close asChild>
                        <Button variant="ghost" size="icon"><X /></Button>
                    </Dialog.Close>
                </div>
                
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g., Web Development" /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Publication Date</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cover Image URL</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Content (Markdown supported)</FormLabel>
                            <FormControl><Textarea {...field} rows={10} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <FormLabel>Tags</FormLabel>
                        <div className="space-y-2 mt-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name={`tags.${index}`}
                                render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl><Input {...field} /></FormControl>
                                </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                        ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append('')}>
                           <PlusCircle className="mr-2 h-4 w-4" /> Add Tag
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Featured Post</FormLabel>
                                    <FormDescription>
                                    Mark this post as featured to highlight it on the main blog page.
                                    </FormDescription>
                                </div>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="isPremium"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Premium Post</FormLabel>
                                    <FormDescription>
                                    Mark this post as premium. It will require a subscription to read.
                                    </FormDescription>
                                </div>
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className="flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                        ) : (
                        'Save Post'
                        )}
                    </Button>
                    </div>
                </form>
                </Form>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
  );
}

export function DeletePostButton({ id }: { id: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        if(confirm('Are you sure you want to delete this post?')) {
            const result = await deleteBlogPost(id);
            if(result.success) {
                toast({title: "Post deleted successfully!"});
            } else {
                toast({title: "Error deleting post", description: result.error, variant: 'destructive'})
            }
        }
    }
    
    return (
        <Button variant="destructive" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4"/></Button>
    )
}
