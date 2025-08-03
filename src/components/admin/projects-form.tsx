
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addProject, updateProject, deleteProject } from '@/app/admin/projects/actions';
import { projectSchema, Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle, Loader2, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from 'react';

type FormValues = Omit<Project, 'id'>;

export function ProjectForm({ projectToEdit }: { projectToEdit?: Project }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues: FormValues = {
    title: projectToEdit?.title || '',
    client: projectToEdit?.client || '',
    description: projectToEdit?.description || '',
    imageUrl: projectToEdit?.imageUrl || 'https://placehold.co/800x600.png',
    imageAiHint: projectToEdit?.imageAiHint || 'project screenshot',
    category: projectToEdit?.category || '',
    tags: projectToEdit?.tags || [],
    link: projectToEdit?.link || '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema.omit({ id: true })),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const onSubmit = async (data: FormValues) => {
    const result = projectToEdit
      ? await updateProject(projectToEdit.id, data)
      : await addProject(data);
      
    if (result.success) {
      toast({ title: 'Success', description: `Project ${projectToEdit ? 'updated' : 'added'} successfully.` });
      form.reset(defaultValues);
      setIsOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save project.',
      });
      console.error(result.error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
            {projectToEdit ? (
                <Button variant="outline" size="icon"><Edit className="h-4 w-4"/></Button>
            ) : (
                <Button><PlusCircle className="mr-2 h-4 w-4"/> Add New Project</Button>
            )}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-background p-6 rounded-lg shadow-lg overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-2xl font-bold">{projectToEdit ? 'Edit Project' : 'Add New Project'}</Dialog.Title>
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
                            name="client"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Client</FormLabel>
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
                                <FormControl><Input {...field} placeholder="e.g., UI/UX Design" /></FormControl>
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
                        name="link"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Project Link (Optional)</FormLabel>
                            <FormControl><Input {...field} placeholder="https://example.com" /></FormControl>
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
                        'Save Project'
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

export function DeleteProjectButton({ id }: { id: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        if(confirm('Are you sure you want to delete this project?')) {
            const result = await deleteProject(id);
            if(result.success) {
                toast({title: "Project deleted successfully!"});
            } else {
                toast({title: "Error deleting project", description: result.error, variant: 'destructive'})
            }
        }
    }
    
    return (
        <Button variant="destructive" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4"/></Button>
    )
}
