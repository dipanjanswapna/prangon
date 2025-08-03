
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addPrangonsLikhaPost, updatePrangonsLikhaPost, deletePrangonsLikhaPost } from '@/app/admin/prangons-likha/actions';
import { prangonsLikhaPostSchema, PrangonsLikhaPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, PlusCircle, Loader2, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from 'react';

type FormValues = Omit<PrangonsLikhaPost, 'id' | 'slug'>;

export function PrangonsLikhaForm({ postToEdit }: { postToEdit?: PrangonsLikhaPost }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues: FormValues = {
    title: postToEdit?.title || '',
    author: postToEdit?.author || '',
    category: postToEdit?.category || '',
    coverImage: postToEdit?.coverImage || 'https://placehold.co/600x400.png',
    imageAiHint: postToEdit?.imageAiHint || '',
    content: postToEdit?.content || '',
    tags: postToEdit?.tags || [],
    isPremium: postToEdit?.isPremium || false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(prangonsLikhaPostSchema.omit({id: true, slug: true})),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const onSubmit = async (data: FormValues) => {
    const result = postToEdit 
      ? await updatePrangonsLikhaPost(postToEdit.id, data)
      : await addPrangonsLikhaPost(data);
      
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
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Post</CardTitle>
                        <CardDescription>Create a new literary piece for your collection.</CardDescription>
                    </CardHeader>
                </Card>
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
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl><Input {...field} placeholder="e.g., অণুগল্প" /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            name="imageAiHint"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Image AI Hint</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g., book cover" /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Content</FormLabel>
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
                                Mark this post as premium. It might be featured more prominently.
                                </FormDescription>
                            </div>
                            </FormItem>
                        )}
                    />

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
            const result = await deletePrangonsLikhaPost(id);
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
