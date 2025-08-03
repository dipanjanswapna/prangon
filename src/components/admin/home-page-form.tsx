
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateHomePageContent } from '@/app/admin/home/actions';
import { homePageSchema, HomePageData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export function HomePageForm({ initialData }: { initialData: HomePageData }) {
  const { toast } = useToast();
  const form = useForm<HomePageData>({
    resolver: zodResolver(homePageSchema),
    defaultValues: initialData,
  });

  const { fields: animatedTextFields, append: appendAnimatedText, remove: removeAnimatedText } = useFieldArray({
    control: form.control,
    name: 'heroAnimatedTexts',
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({
    control: form.control,
    name: 'testimonials',
  });
  
    const { fields: toolboxFields, append: appendToolbox, remove: removeToolbox } = useFieldArray({
    control: form.control,
    name: 'toolboxItems',
  });

  const { fields: videoFields, append: appendVideo, remove: removeVideo } = useFieldArray({
    control: form.control,
    name: 'videos',
  });

  const onSubmit = async (data: HomePageData) => {
    const result = await updateHomePageContent(data);
    if (result.success) {
      toast({ title: 'Success', description: 'Home page content updated successfully.' });
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
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Manage the main banner content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="heroWelcomeText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Text</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroBackgroundImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Separator />
             <div>
              <h4 className="font-semibold mb-2">Animated Typing Texts</h4>
              {animatedTextFields.map((field, index) => (
                <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center gap-2 mb-2">
                  <FormField
                    control={form.control}
                    name={`heroAnimatedTexts.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input {...field} placeholder={`Animated text #${index + 1}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeAnimatedText(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendAnimatedText('')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Text
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Me Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="aboutMeText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me Text</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aboutMeImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Section</CardTitle>
            <CardDescription>List your skills.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillFields.map((field, index) => (
              <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`skills.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input {...field} placeholder={`Skill #${index + 1}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" size="icon" onClick={() => removeSkill(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendSkill('')}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Stats Section</CardTitle>
                <CardDescription>Manage the stats displayed on the home page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="stats.happyCustomers"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Happy Customers</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stats.servicesProvided"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Services Provided</FormLabel>
                            <FormControl>
                               <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <p className="text-sm text-muted-foreground">Other stats like 'Books & Writings' and 'Subscription Packages' are calculated automatically.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Testimonials Section</CardTitle>
                <CardDescription>Manage client testimonials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {testimonialFields.map((field, index) => (
                    <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="space-y-4 p-4 border rounded-md relative">
                         <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeTestimonial(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <FormField
                            control={form.control}
                            name={`testimonials.${index}.quote`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Quote</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField
                                control={form.control}
                                name={`testimonials.${index}.author`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Author</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`testimonials.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Author's Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name={`testimonials.${index}.image`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => appendTestimonial({ quote: '', author: '', title: '', image: 'https://placehold.co/100x100.png', imageAiHint: 'person' }, { shouldFocus: false })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
                </Button>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Info Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Toolbox Items</h3>
                    {toolboxFields.map((field, index) => (
                        <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="flex items-center gap-2 mb-2">
                             <FormField
                                control={form.control}
                                name={`toolboxItems.${index}.name`}
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormControl>
                                            <Input {...field} placeholder={`Tool #${index + 1}`} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeToolbox(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendToolbox({ name: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Tool
                    </Button>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="readsImage"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>My Reads Image URL</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hobbiesImage"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>My Hobbies Image URL</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
         </Card>

        <Card>
            <CardHeader>
                <CardTitle>Latest Videos Section</CardTitle>
                <CardDescription>Manage YouTube videos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {videoFields.map((field, index) => (
                    <motion.div key={field.id} variants={itemVariants} initial="hidden" animate="visible" className="space-y-4 p-4 border rounded-md relative">
                         <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeVideo(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <FormField
                            control={form.control}
                            name={`videos.${index}.title`}
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
                            name={`videos.${index}.author`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`videos.${index}.timestamp`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Timestamp</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`videos.${index}.thumbnail`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Thumbnail URL</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => appendVideo({ title: '', author: '', timestamp: '', thumbnail: 'https://placehold.co/400x225.png', thumbnailAiHint: 'video thumbnail' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Video
                </Button>
            </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
