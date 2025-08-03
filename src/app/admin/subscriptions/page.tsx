
import { getSubscriptionPlans } from './actions';
import { SubscriptionPlanForm, DeletePlanButton } from '@/components/admin/subscription-plan-form';
import { SubscriptionPlan } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';

export default async function AdminSubscriptionsPage() {
  const plans = await getSubscriptionPlans();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Manage Subscriptions</h2>
                <p className="text-muted-foreground">
                Create, edit, or delete subscription plans.
                </p>
            </div>
             <SubscriptionPlanForm />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Existing Plans</CardTitle>
                <CardDescription>View and manage all your current subscription plans.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {plans.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {plans.map(plan => (
                            <Card key={plan.id} className="flex flex-col">
                                {plan.isPopular && (
                                    <div className="bg-primary text-primary-foreground text-center py-1.5 px-4 text-sm font-bold rounded-t-lg flex items-center justify-center gap-1">
                                        <Star className="h-4 w-4"/> Most Popular
                                    </div>
                                )}
                                <CardHeader className="text-center">
                                    <CardTitle>{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                     <div className="text-center mb-6">
                                        <p className="text-sm text-muted-foreground">
                                            <span className="text-2xl font-bold text-primary-foreground">${plan.priceMonthly}</span>/month
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                           <span className="font-bold text-primary-foreground">${plan.priceYearly}</span>/year
                                        </p>
                                    </div>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, i) => (
                                             <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Check className="h-4 w-4 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <div className="flex-shrink-0 flex justify-center gap-2 p-4">
                                    <SubscriptionPlanForm planToEdit={plan} />
                                    <DeletePlanButton id={plan.id} />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center">No subscription plans found.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
