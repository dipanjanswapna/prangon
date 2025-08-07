'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { visualArtSchema, VisualArt } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'public/visual-arts.json');

async function readData(): Promise<VisualArt[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

async function writeData(data: VisualArt[]) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to visual-arts.json', error);
    throw new Error('Failed to update visual arts in database.');
  }
}

export async function getVisualArts(): Promise<VisualArt[]> {
  return await readData();
}

export async function addVisualArt(data: Omit<VisualArt, 'id'>) {
    const items = await readData();
    const validation = visualArtSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newItem: VisualArt = {
        ...validation.data,
        id: Date.now().toString(),
    };

    items.unshift(newItem);
    
    try {
        await writeData(items);
        revalidatePath('/visual-arts');
        revalidatePath('/admin/visual-arts');
        return { success: true, item: newItem };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateVisualArt(id: string, data: Omit<VisualArt, 'id'>) {
    const items = await readData();
    const validation = visualArtSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    const itemIndex = items.findIndex(p => p.id === id);
    if (itemIndex === -1) {
        return { success: false, error: 'Artwork not found.' };
    }

    const updatedItem = {
        ...items[itemIndex],
        ...validation.data,
    };
    items[itemIndex] = updatedItem;

    try {
        await writeData(items);
        revalidatePath('/visual-arts');
        revalidatePath('/admin/visual-arts');
        return { success: true, item: updatedItem };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteVisualArt(id: string) {
    const items = await readData();
    const updatedItems = items.filter(p => p.id !== id);

    if (items.length === updatedItems.length) {
         return { success: false, error: 'Artwork not found.' };
    }
    
    try {
        await writeData(updatedItems);
        revalidatePath('/visual-arts');
        revalidatePath('/admin/visual-arts');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
