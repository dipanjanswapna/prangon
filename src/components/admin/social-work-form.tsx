
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSocialWorkPageData } from '@/app/admin/social-work/actions';
import { socialWorkPageSchema, SocialWorkPageData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function SocialWorkPageForm({ initialData }: { initialData: SocialWorkPageData }) {
  const { toast } = useToast();
  const form = useForm<SocialWorkPageData>({
    resolver: zodResolver(socialWorkPageSchema),
    defaultValues: {
      initiatives: initialData.initiatives || [],
      testimonials: initialData.testimonials || [],
    },
  });

  const { fields: initiativeFields, append: appendInitiative, remove: removeInitiative } = useFieldArray({
    control: form.control, name: 'initiatives'
  });
  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({
    control: form.control, name: 'testimonials'
  });

  const onSubmit = async (data: SocialWorkPageData) => {
    const result = await updateSocialWorkPageData(data);
    if (result.success) {
      toast({ title: 'Success', description: 'Social Work page content updated successfully.' });
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
              <CardTitle>Initiatives</CardTitle>
              <CardDescription>Manage the social work projects and initiatives.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {initiativeFields.map((field, index) => (
              <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="space-y-4 p-4 border rounded-md relative">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeInitiative(index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <FormField control={form.control} name={`initiatives.${index}.title`} render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField
                    control={form.control}
                    name={`initiatives.${index}.category`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Environment">Environment</SelectItem>
                                <SelectItem value="Humanitarian">Humanitarian</SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Community">Community</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name={`initiatives.${index}.description`} render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name={`initiatives.${index}.impact`} render={({ field }) => (
                  <FormItem><FormLabel>Impact</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name={`initiatives.${index}.imageUrl`} render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </motion.div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendInitiative({ id: '', title: '', category: 'Community', description: '', impact: '', imageUrl: 'https://placehold.co/600x400.png', tags: [] })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Initiative
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>Manage testimonials for the social work page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {testimonialFields.map((field, index) => (
              <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="space-y-4 p-4 border rounded-md relative">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeTestimonial(index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <FormField control={form.control} name={`testimonials.${index}.quote`} render={({ field }) => (
                  <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name={`testimonials.${index}.author`} render={({ field }) => (
                  <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name={`testimonials.${index}.role`} render={({ field }) => (
                  <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name={`testimonials.${index}.imageUrl`} render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </motion.div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendTestimonial({ id: '', quote: '', author: '', role: '', imageUrl: 'https://placehold.co/100x100.png' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
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
