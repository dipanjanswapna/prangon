
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Project } from '@/lib/projects';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  category: z.string().min(2, 'Category is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  imageUrl: z.string().url('Please enter a valid image URL.'),
  tags: z.string().min(1, 'Please enter at least one tag, comma separated.'),
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
    project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const { toast } = useToast();
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || '',
      category: project?.category || '',
      description: project?.description || '',
      imageUrl: project?.imageUrl || '',
      tags: project?.tags.join(', ') || '',
    },
  });

  function onSubmit(data: ProjectFormValues) {
    // In a real app, you'd handle form submission here (e.g., API call)
    console.log(data);
    toast({
      title: `Project ${project ? 'Updated' : 'Created'}!`,
      description: `The project "${data.title}" has been successfully saved.`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? 'Edit Project' : 'Create a new project'}</CardTitle>
        <CardDescription>Fill out the form below to {project ? 'update the' : 'add a new'} project.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Title" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input placeholder="e.g., UI/UX Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of the project" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Figma, React, UI/UX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{project ? 'Update' : 'Create'} Project</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
