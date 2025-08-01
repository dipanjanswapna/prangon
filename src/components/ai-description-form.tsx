'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  generateProjectDescription,
  GenerateProjectDescriptionInput,
} from '@/ai/flows/generate-project-description';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Loader2, Sparkles, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: 'Project name must be at least 2 characters.',
  }),
  projectDetails: z.string().min(10, {
    message: 'Please provide more details about your project.',
  }),
});

export function AIDescriptionForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      projectDetails: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const output = await generateProjectDescription(
        values as GenerateProjectDescriptionInput
      );
      setResult(output.projectDescription);
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate description. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }
  
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: "Copied to clipboard!",
        description: "The description has been copied.",
      });
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>
            Fill in the details below to generate a description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Aura Health App" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the project goals, features, and target audience..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Description
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center mt-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground mt-2">Generating... please wait.</p>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Generated Description</CardTitle>
              <CardDescription>
                Here is the AI-generated description for your project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{result}</p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4"/>
                    Copy Text
                </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
