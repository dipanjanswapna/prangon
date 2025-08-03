
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addAchievement, updateAchievement, deleteAchievement } from '@/app/admin/achievements/actions';
import { achievementSchema, Achievement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Loader2, Edit, X, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type FormValues = Omit<Achievement, 'id'>;

export function AchievementForm({ achievementToEdit }: { achievementToEdit?: Achievement }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues: FormValues = {
    title: achievementToEdit?.title || '',
    issuer: achievementToEdit?.issuer || '',
    date: achievementToEdit?.date || '',
    description: achievementToEdit?.description || '',
    category: achievementToEdit?.category || 'Award',
    link: achievementToEdit?.link || '',
    imageUrl: achievementToEdit?.imageUrl || 'https://placehold.co/600x400.png',
    imageAiHint: achievementToEdit?.imageAiHint || 'award',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(achievementSchema.omit({ id: true })),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    const result = achievementToEdit
      ? await updateAchievement(achievementToEdit.id, data)
      : await addAchievement(data);
      
    if (result.success) {
      toast({ title: 'Success', description: `Achievement ${achievementToEdit ? 'updated' : 'added'} successfully.` });
      form.reset(defaultValues);
      setIsOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save achievement.',
      });
      console.error(result.error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
            {achievementToEdit ? (
                <Button variant="outline" size="icon"><Edit className="h-4 w-4"/></Button>
            ) : (
                <Button><PlusCircle className="mr-2 h-4 w-4"/> Add New Achievement</Button>
            )}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-background p-6 rounded-lg shadow-lg overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-2xl font-bold">{achievementToEdit ? 'Edit Achievement' : 'Add New Achievement'}</Dialog.Title>
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
                            name="issuer"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Issuer</FormLabel>
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
                                <FormLabel>Date</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g., 2022 or Jan 2022" /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea {...field} rows={4} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <SelectItem value="Award">Award</SelectItem>
                                        <SelectItem value="Certification">Certification</SelectItem>
                                        <SelectItem value="Academic">Academic</SelectItem>
                                        <SelectItem value="Leadership">Leadership</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Link (Optional)</FormLabel>
                                <FormControl><Input {...field} placeholder="https://example.com" /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
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
                        'Save Achievement'
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

export function DeleteAchievementButton({ id }: { id: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        if(confirm('Are you sure you want to delete this achievement?')) {
            const result = await deleteAchievement(id);
            if(result.success) {
                toast({title: "Achievement deleted successfully!"});
            } else {
                toast({title: "Error deleting achievement", description: result.error, variant: 'destructive'})
            }
        }
    }
    
    return (
        <Button variant="destructive" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4"/></Button>
    )
}
