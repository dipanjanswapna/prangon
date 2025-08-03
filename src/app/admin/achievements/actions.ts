
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { achievementSchema, Achievement } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'achievements.json');

async function readData(): Promise<Achievement[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

async function writeData(data: Achievement[]) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to achievements.json', error);
    throw new Error('Failed to update achievements in database.');
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  return await readData();
}

export async function addAchievement(data: Omit<Achievement, 'id'>) {
    const items = await readData();
    const validation = achievementSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newItem: Achievement = {
        ...validation.data,
        id: Date.now().toString(),
    };

    items.unshift(newItem);
    
    try {
        await writeData(items);
        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true, item: newItem };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateAchievement(id: string, data: Omit<Achievement, 'id'>) {
    const items = await readData();
    const validation = achievementSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    const itemIndex = items.findIndex(p => p.id === id);
    if (itemIndex === -1) {
        return { success: false, error: 'Achievement not found.' };
    }

    const updatedItem = {
        ...items[itemIndex],
        ...validation.data,
    };
    items[itemIndex] = updatedItem;

    try {
        await writeData(items);
        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true, item: updatedItem };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAchievement(id: string) {
    const items = await readData();
    const updatedItems = items.filter(p => p.id !== id);

    if (items.length === updatedItems.length) {
         return { success: false, error: 'Achievement not found.' };
    }
    
    try {
        await writeData(updatedItems);
        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
