
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { AppUser } from '@/lib/types';
import { User } from 'firebase/auth';
import { getSubscriptionPlans } from '../subscriptions/actions';

const dataFilePath = path.join(process.cwd(), 'users.json');

async function readUsers(): Promise<AppUser[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    // Ensure we return an array even if the file is empty
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    // If the file doesn't exist, it's not an error, just means no users yet.
    return [];
  }
}

async function writeUsers(data: AppUser[]) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to users.json', error);
    throw new Error('Failed to update users in database.');
  }
}

export async function getAllUsers(): Promise<AppUser[]> {
    return await readUsers();
}

export async function getUserData(uid: string): Promise<AppUser | null> {
    const users = await readUsers();
    return users.find(u => u.uid === uid) || null;
}

export async function findOrCreateUser(firebaseUser: User): Promise<AppUser> {
    let users = await readUsers();
    const existingUser = users.find(u => u.uid === firebaseUser.uid);

    if (existingUser) {
        return existingUser;
    }

    // Create new user if not found
    const customId = (Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8)).toUpperCase();
    
    const newUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'No Name',
        customId: customId,
        subscription: {
            planName: '',
            startDate: '',
            endDate: '',
        }
    };
    
    users.push(newUser);
    await writeUsers(users);
    
    return newUser;
}


export async function manageSubscription(userId: string, action: 'grant' | 'revoke', planId?: string) {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.customId === userId);

    if (userIndex === -1) {
        return { success: false, error: 'User not found.' };
    }

    if (action === 'grant') {
        if (!planId) return { success: false, error: 'Plan ID is required to grant a subscription.' };
        
        const plans = await getSubscriptionPlans();
        const plan = plans.find(p => p.id === planId);
        if (!plan) return { success: false, error: 'Subscription plan not found.' };

        users[userIndex].subscription = {
            planName: plan.name,
            startDate: new Date().toISOString(),
            endDate: '', // Or calculate an end date
        };
    } else { // revoke
        users[userIndex].subscription = {
            planName: '',
            startDate: '',
            endDate: '',
        };
    }
    
    try {
        await writeUsers(users);
        revalidatePath('/admin/users');
        revalidatePath('/account');
        return { success: true, user: users[userIndex] };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
