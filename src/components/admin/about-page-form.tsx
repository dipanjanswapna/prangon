
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateAboutPageContent } from '@/app/admin/about/actions';
import { aboutPageSchema, AboutPageData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export function AboutPageForm({ initialData }: { initialData: AboutPageData }) {
  const { toast } = useToast();
  const form = useForm<AboutPageData>({
    resolver: zodResolver(aboutPageSchema),
    defaultValues: initialData,
  });

  const { fields: academiaFields, append: appendAcademia, remove: removeAcademia } = useFieldArray({
    control: form.control, name: 'academia.features'
  });
  const { fields: servicesFields, append: appendServices, remove: removeServices } = useFieldArray({
    control: form.control, name: 'services.features'
  });
  const { fields: accordionFields, append: appendAccordion, remove: removeAccordion } = useFieldArray({
    control: form.control, name: 'services.accordionItems'
  });

  const onSubmit = async (data: AboutPageData) => {
    const result = await updateAboutPageContent(data);
    if (result.success) {
      toast({ title: 'Success', description: 'About page content updated successfully.' });
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
          <CardHeader><CardTitle>Main Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="tagline" render={({ field }) => (
              <FormItem><FormLabel>Tagline</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="profileImageUrl" render={({ field }) => (
              <FormItem><FormLabel>Profile Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="coverPhotoUrl" render={({ field }) => (
              <FormItem><FormLabel>Cover Photo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="backgroundImageUrl" render={({ field }) => (
              <FormItem><FormLabel>Background Image URL (Fallback)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academia Section</CardTitle>
            <CardDescription>"For Academia & Scholarships" Tab</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField control={form.control} name="academia.title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="academia.description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <Separator />
            <h4 className="font-semibold">Features</h4>
            {academiaFields.map((field, index) => (
              <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="space-y-2 p-4 border rounded-md relative">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeAcademia(index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <FormField control={form.control} name={`academia.features.${index}.title`} render={({ field }) => (
                  <FormItem><FormLabel>Feature Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name={`academia.features.${index}.description`} render={({ field }) => (
                  <FormItem><FormLabel>Feature Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </motion.div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendAcademia({ title: '', description: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Academia Feature
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services Section</CardTitle>
            <CardDescription>"For Professional Services" Tab</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField control={form.control} name="services.title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="services.description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <Separator />
            <h4 className="font-semibold">Accordion Items</h4>
            {accordionFields.map((field, index) => (
              <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="space-y-2 p-4 border rounded-md relative">
                 <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeAccordion(index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <FormField control={form.control} name={`services.accordionItems.${index}.title`} render={({ field }) => (
                  <FormItem><FormLabel>Accordion Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name={`services.accordionItems.${index}.content`} render={({ field }) => (
                  <FormItem><FormLabel>Accordion Content</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </motion.div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendAccordion({ title: '', content: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Accordion Item
            </Button>
            <Separator />
            <h4 className="font-semibold">Features</h4>
            {servicesFields.map((field, index) => (
              <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="space-y-2 p-4 border rounded-md relative">
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeServices(index)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
                <FormField control={form.control} name={`services.features.${index}.title`} render={({ field }) => (
                  <FormItem><FormLabel>Feature Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name={`services.features.${index}.description`} render={({ field }) => (
                  <FormItem><FormLabel>Feature Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </motion.div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendServices({ title: '', description: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Service Feature
            </Button>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>Biography</CardTitle></CardHeader>
            <CardContent>
                 <FormField control={form.control} name="biography" render={({ field }) => (
                  <FormItem><FormLabel>Biography Text</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
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
