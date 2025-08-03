
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { experienceSchema, Experience } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'experiences.json');

async function readData(): Promise<Experience[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

async function writeData(data: Experience[]) {
  try {
    // Sort by period before writing
    const sortedData = data.sort((a, b) => new Date(b.period.split(' - ')[0]).getTime() - new Date(a.period.split(' - ')[0]).getTime());
    const jsonString = JSON.stringify(sortedData, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to experiences.json', error);
    throw new Error('Failed to update experiences in database.');
  }
}

export async function getExperiences(): Promise<Experience[]> {
  return await readData();
}

export async function addExperience(data: Omit<Experience, 'id'>) {
    const items = await readData();
    const validation = experienceSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newItem: Experience = {
        ...validation.data,
        id: Date.now().toString(),
    };

    items.push(newItem);
    
    try {
        await writeData(items);
        revalidatePath('/experiences');
        revalidatePath('/admin/experiences');
        return { success: true, item: newItem };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateExperience(id: string, data: Omit<Experience, 'id'>) {
    const items = await readData();
    const validation = experienceSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    const itemIndex = items.findIndex(p => p.id === id);
    if (itemIndex === -1) {
        return { success: false, error: 'Experience not found.' };
    }

    const updatedItem = {
        ...items[itemIndex],
        ...validation.data,
    };
    items[itemIndex] = updatedItem;

    try {
        await writeData(items);
        revalidatePath('/experiences');
        revalidatePath('/admin/experiences');
        return { success: true, item: updatedItem };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteExperience(id: string) {
    const items = await readData();
    const updatedItems = items.filter(p => p.id !== id);

    if (items.length === updatedItems.length) {
         return { success: false, error: 'Experience not found.' };
    }
    
    try {
        await writeData(updatedItems);
        revalidatePath('/experiences');
        revalidatePath('/admin/experiences');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
