
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateFAQPageData } from '@/app/admin/faq/actions';
import { faqPageSchema, FAQPageData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export function FAQPageForm({ initialData }: { initialData: FAQPageData }) {
  const { toast } = useToast();
  const form = useForm<FAQPageData>({
    resolver: zodResolver(faqPageSchema),
    defaultValues: {
      faqs: initialData.faqs || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control, name: 'faqs'
  });

  const onSubmit = async (data: FAQPageData) => {
    const result = await updateFAQPageData(data);
    if (result.success) {
      toast({ title: 'Success', description: 'FAQ content updated successfully.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update content. Please check the form for errors.',
      });
      console.error(result.error);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <Card>
          <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Manage the FAQs displayed on the homepage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="space-y-4 p-4 border rounded-md relative">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <FormField control={form.control} name={`faqs.${index}.question`} render={({ field }) => (
                  <FormItem><FormLabel>Question</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name={`faqs.${index}.answer`} render={({ field }) => (
                  <FormItem><FormLabel>Answer</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </motion.div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: '', question: '', answer: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
            ) : ( 'Save Changes' )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
