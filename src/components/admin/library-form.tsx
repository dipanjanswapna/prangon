
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addLibraryItem, updateLibraryItem, deleteLibraryItem } from '@/app/admin/library/actions';
import { libraryItemSchema, LibraryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle, Loader2, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type FormValues = Omit<LibraryItem, 'id' | 'slug'>;

export function LibraryForm({ itemToEdit }: { itemToEdit?: LibraryItem }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues: FormValues = {
    title: itemToEdit?.title || '',
    author: itemToEdit?.author || '',
    category: itemToEdit?.category || 'Book',
    coverImage: itemToEdit?.coverImage || 'https://placehold.co/600x800.png',
    imageAiHint: itemToEdit?.imageAiHint || 'book cover',
    content: itemToEdit?.content || '',
    pdfUrl: itemToEdit?.pdfUrl || '',
    documentAiHint: itemToEdit?.documentAiHint || 'document screenshot',
    tags: itemToEdit?.tags || [],
    isFeatured: itemToEdit?.isFeatured || false,
    isPremium: itemToEdit?.isPremium || false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(libraryItemSchema.omit({id: true, slug: true})),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const onSubmit = async (data: FormValues) => {
    const result = itemToEdit 
      ? await updateLibraryItem(itemToEdit.id, data)
      : await addLibraryItem(data);
      
    if (result.success) {
      toast({ title: 'Success', description: `Item ${itemToEdit ? 'updated' : 'added'} successfully.` });
      form.reset(defaultValues);
      setIsOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save item.',
      });
      console.error(result.error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
            {itemToEdit ? (
                <Button variant="outline" size="icon"><Edit className="h-4 w-4"/></Button>
            ) : (
                <Button><PlusCircle className="mr-2 h-4 w-4"/> Add New Item</Button>
            )}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-background p-6 rounded-lg shadow-lg overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-2xl font-bold">{itemToEdit ? 'Edit Item' : 'Add New Item'}</Dialog.Title>
                    <Dialog.Close asChild>
                        <Button variant="ghost" size="icon"><X /></Button>
                    </Dialog.Close>
                </div>
                
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Author / Publisher</FormLabel>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Book">Book</SelectItem>
                                        <SelectItem value="Weekly Magazine">Weekly Magazine</SelectItem>
                                        <SelectItem value="Monthly Magazine">Monthly Magazine</SelectItem>
                                        <SelectItem value="Comic Book">Comic Book</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            <FormLabel>Content / Description</FormLabel>
                            <FormControl><Textarea {...field} rows={5} placeholder="Full text for text reader or short description for PDF viewer."/></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                     <FormField
                        control={form.control}
                        name="pdfUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>PDF/Document URL</FormLabel>
                            <FormControl><Input {...field} placeholder="e.g., a shareable Google Drive link" /></FormControl>
                            <FormDescription>Link to the viewable document (PDF, Google Doc, etc.)</FormDescription>
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
                                    <FormLabel>Featured Item</FormLabel>
                                    <FormDescription>
                                    Mark this item as featured to highlight it on the library page.
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
                                    <FormLabel>Premium Item</FormLabel>
                                    <FormDescription>
                                    Mark this item as premium. It will require a subscription to view.
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
                        'Save Item'
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

export function DeleteLibraryItemButton({ id }: { id: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        if(confirm('Are you sure you want to delete this item?')) {
            const result = await deleteLibraryItem(id);
            if(result.success) {
                toast({title: "Item deleted successfully!"});
            } else {
                toast({title: "Error deleting item", description: result.error, variant: 'destructive'})
            }
        }
    }
    
    return (
        <Button variant="destructive" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4"/></Button>
    )
}
