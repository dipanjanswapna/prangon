'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addVisualArt, updateVisualArt, deleteVisualArt } from '@/app/admin/visual-arts/actions';
import { visualArtSchema, VisualArt } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle, Loader2, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type FormValues = Omit<VisualArt, 'id'>;

export function VisualArtForm({ artToEdit }: { artToEdit?: VisualArt }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues: FormValues = {
    title: artToEdit?.title || '',
    description: artToEdit?.description || '',
    imageUrl: artToEdit?.imageUrl || 'https://placehold.co/600x600.png',
    imageAiHint: artToEdit?.imageAiHint || 'visual art',
    category: artToEdit?.category || 'Illustration',
    tags: artToEdit?.tags || [],
    tools: artToEdit?.tools || [],
    date: artToEdit?.date || new Date().toISOString().split('T')[0],
    likes: artToEdit?.likes || 0,
    comments: artToEdit?.comments || [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(visualArtSchema.omit({ id: true })),
    defaultValues,
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control: form.control, name: "tags",
  });
  
  const { fields: toolFields, append: appendTool, remove: removeTool } = useFieldArray({
    control: form.control, name: "tools",
  });

  const onSubmit = async (data: FormValues) => {
    const result = artToEdit 
      ? await updateVisualArt(artToEdit.id, data)
      : await addVisualArt(data);
      
    if (result.success) {
      toast({ title: 'Success', description: `Artwork ${artToEdit ? 'updated' : 'added'} successfully.` });
      form.reset(defaultValues);
      setIsOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save artwork.',
      });
      console.error(result.error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
            {artToEdit ? (
                <Button variant="outline" size="sm" className="w-full">Edit</Button>
            ) : (
                <Button><PlusCircle className="mr-2 h-4 w-4"/> Add New Art</Button>
            )}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-background p-6 rounded-lg shadow-lg overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-2xl font-bold">{artToEdit ? 'Edit Artwork' : 'Add New Artwork'}</Dialog.Title>
                    <Dialog.Close asChild>
                        <Button variant="ghost" size="icon"><X /></Button>
                    </Dialog.Close>
                </div>
                
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField name="title" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    
                    <FormField name="description" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>

                    <FormField name="imageUrl" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField name="category" control={form.control} render={({ field }) => (
                            <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Handmade Art">Handmade Art</SelectItem>
                                    <SelectItem value="Illustration">Illustration</SelectItem>
                                    <SelectItem value="Photography">Photography</SelectItem>
                                    <SelectItem value="Graphics Design">Graphics Design</SelectItem>
                                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField name="date" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>

                    <div>
                        <FormLabel>Tools</FormLabel>
                        <div className="space-y-2 mt-2">
                        {toolFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <FormField name={`tools.${index}`} control={form.control} render={({ field }) => (
                                    <FormItem className="flex-grow"><FormControl><Input {...field} /></FormControl></FormItem>
                                )}/>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeTool(index)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendTool('')}><PlusCircle className="mr-2 h-4 w-4" /> Add Tool</Button>
                    </div>

                    <div>
                        <FormLabel>Tags</FormLabel>
                        <div className="space-y-2 mt-2">
                        {tagFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <FormField name={`tags.${index}`} control={form.control} render={({ field }) => (
                                    <FormItem className="flex-grow"><FormControl><Input {...field} /></FormControl></FormItem>
                                )}/>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeTag(index)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendTag('')}><PlusCircle className="mr-2 h-4 w-4" /> Add Tag</Button>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Artwork'}
                        </Button>
                    </div>
                </form>
                </Form>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
  );
}

export function DeleteArtButton({ id }: { id: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        if(confirm('Are you sure you want to delete this artwork?')) {
            const result = await deleteVisualArt(id);
            if(result.success) {
                toast({title: "Artwork deleted successfully!"});
            } else {
                toast({title: "Error deleting artwork", description: result.error, variant: 'destructive'})
            }
        }
    }
    
    return (
        <Button variant="destructive" size="sm" className="w-full" onClick={handleDelete}>Delete</Button>
    )
}
