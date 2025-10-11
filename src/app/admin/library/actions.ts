
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { libraryItemSchema, LibraryItem } from '@/lib/types';
import slugify from 'slugify';

const dataFilePath = path.join(process.cwd(), 'data/library.json');

async function readData(): Promise<LibraryItem[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

async function writeData(data: LibraryItem[]) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to library.json', error);
    throw new Error('Failed to update library items in database.');
  }
}

export async function getLibraryItems(): Promise<LibraryItem[]> {
  return await readData();
}

export async function addLibraryItem(data: Omit<LibraryItem, 'id' | 'slug'>) {
    const items = await readData();
    const validation = libraryItemSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newItem: LibraryItem = {
        ...validation.data,
        id: Date.now().toString(),
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };

    items.push(newItem);
    
    try {
        await writeData(items);
        revalidatePath('/library');
        revalidatePath('/admin/library');
        return { success: true, item: newItem };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateLibraryItem(id: string, data: Omit<LibraryItem, 'id' | 'slug'>) {
    const items = await readData();
    const validation = libraryItemSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    const itemIndex = items.findIndex(p => p.id === id);
    if (itemIndex === -1) {
        return { success: false, error: 'Item not found.' };
    }

    const updatedItem = {
        ...items[itemIndex],
        ...validation.data,
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };
    items[itemIndex] = updatedItem;

    try {
        await writeData(items);
        revalidatePath('/library');
        revalidatePath(`/library/${updatedItem.slug}`);
        revalidatePath('/admin/library');
        return { success: true, item: updatedItem };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteLibraryItem(id: string) {
    const items = await readData();
    const updatedItems = items.filter(p => p.id !== id);

    if (items.length === updatedItems.length) {
         return { success: false, error: 'Item not found.' };
    }
    
    try {
        await writeData(updatedItems);
        revalidatePath('/library');
        revalidatePath('/admin/library');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
