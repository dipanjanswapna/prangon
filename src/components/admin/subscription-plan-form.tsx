
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from '@/app/admin/subscriptions/actions';
import { subscriptionPlanSchema, SubscriptionPlan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, PlusCircle, Loader2, Edit, X, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from 'react';
import { Separator } from '../ui/separator';

type FormValues = Omit<SubscriptionPlan, 'id'>;

export function SubscriptionPlanForm({ planToEdit }: { planToEdit?: SubscriptionPlan }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const defaultValues: FormValues = {
    name: planToEdit?.name || '',
    description: planToEdit?.description || '',
    priceMonthly: planToEdit?.priceMonthly || 0,
    priceYearly: planToEdit?.priceYearly || 0,
    features: planToEdit?.features || [],
    isPopular: planToEdit?.isPopular || false,
    promoCodes: planToEdit?.promoCodes || [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(subscriptionPlanSchema.omit({id: true})),
    defaultValues,
  });
  
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: "features",
  });
  
  const { fields: promoCodeFields, append: appendPromoCode, remove: removePromoCode } = useFieldArray({
      control: form.control,
      name: "promoCodes",
  });

  const onSubmit = async (data: FormValues) => {
    const result = planToEdit 
      ? await updateSubscriptionPlan(planToEdit.id, data)
      : await addSubscriptionPlan(data);
      
    if (result.success) {
      toast({ title: 'Success', description: `Plan ${planToEdit ? 'updated' : 'added'} successfully.` });
      form.reset(defaultValues);
      setIsOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save plan.',
      });
      console.error(result.error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
            {planToEdit ? (
                <Button variant="outline" size="icon"><Edit className="h-4 w-4"/></Button>
            ) : (
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Plan</Button>
            )}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-background p-6 rounded-lg shadow-lg overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-2xl font-bold">{planToEdit ? 'Edit Plan' : 'Add New Plan'}</Dialog.Title>
                    <Dialog.Close asChild>
                        <Button variant="ghost" size="icon"><X /></Button>
                    </Dialog.Close>
                </div>
                
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Plan Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
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
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="priceMonthly"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Monthly Price ($)</FormLabel>
                                <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priceYearly"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Yearly Price ($)</FormLabel>
                                <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormLabel>Features</FormLabel>
                        <div className="space-y-2 mt-2">
                        {featureFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name={`features.${index}`}
                                render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl><Input {...field} /></FormControl>
                                </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeFeature(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                        ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendFeature('')}>
                           <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                        </Button>
                    </div>

                    <Separator />

                    <div>
                        <FormLabel>Promo Codes</FormLabel>
                        <div className="space-y-2 mt-2">
                            {promoCodeFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md">
                                    <FormField
                                        control={form.control}
                                        name={`promoCodes.${index}.code`}
                                        render={({ field }) => (
                                            <FormItem className="flex-grow">
                                                <FormControl><Input {...field} placeholder="Code (e.g., EARLYBIRD)" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`promoCodes.${index}.discount`}
                                        render={({ field }) => (
                                            <FormItem className="w-32">
                                                <div className="relative">
                                                    <Input type="number" {...field} placeholder="Discount" onChange={e => field.onChange(parseInt(e.target.value, 10))} className="pr-6"/>
                                                    <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                </div>
                                                 <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removePromoCode(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendPromoCode({ code: '', discount: 10 })}>
                           <PlusCircle className="mr-2 h-4 w-4" /> Add Promo Code
                        </Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="isPopular"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Most Popular</FormLabel>
                                <FormDescription>
                                Mark this plan as the most popular to highlight it.
                                </FormDescription>
                            </div>
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
                        'Save Plan'
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

export function DeletePlanButton({ id }: { id: string }) {
    const { toast } = useToast();
    
    const handleDelete = async () => {
        if(confirm('Are you sure you want to delete this plan?')) {
            const result = await deleteSubscriptionPlan(id);
            if(result.success) {
                toast({title: "Plan deleted successfully!"});
            } else {
                toast({title: "Error deleting plan", description: result.error, variant: 'destructive'})
            }
        }
    }
    
    return (
        <Button variant="destructive" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4"/></Button>
    )
}
