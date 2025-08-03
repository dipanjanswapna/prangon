
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { subscriptionPlanSchema, SubscriptionPlan } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'subscriptions.json');

async function readData(): Promise<SubscriptionPlan[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

async function writeData(data: SubscriptionPlan[]) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to subscriptions.json', error);
    throw new Error('Failed to update subscription plans in database.');
  }
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  return await readData();
}

export async function addSubscriptionPlan(data: Omit<SubscriptionPlan, 'id'>) {
    const plans = await readData();
    const validation = subscriptionPlanSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newPlan: SubscriptionPlan = {
        ...validation.data,
        id: Date.now().toString(),
    };

    plans.push(newPlan);
    
    try {
        await writeData(plans);
        revalidatePath('/subscribe');
        revalidatePath('/admin/subscriptions');
        return { success: true, plan: newPlan };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateSubscriptionPlan(id: string, data: Omit<SubscriptionPlan, 'id'>) {
    const plans = await readData();
    const validation = subscriptionPlanSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    const planIndex = plans.findIndex(p => p.id === id);
    if (planIndex === -1) {
        return { success: false, error: 'Plan not found.' };
    }

    const updatedPlan = {
        ...plans[planIndex],
        ...validation.data,
    };
    plans[planIndex] = updatedPlan;

    try {
        await writeData(plans);
        revalidatePath('/subscribe');
        revalidatePath('/admin/subscriptions');
        return { success: true, plan: updatedPlan };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteSubscriptionPlan(id: string) {
    const plans = await readData();
    const updatedPlans = plans.filter(p => p.id !== id);

    if (plans.length === updatedPlans.length) {
         return { success: false, error: 'Plan not found.' };
    }
    
    try {
        await writeData(updatedPlans);
        revalidatePath('/subscribe');
        revalidatePath('/admin/subscriptions');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
