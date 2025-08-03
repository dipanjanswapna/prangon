
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { projectSchema, Project } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'projects.json');

async function readData(): Promise<Project[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

async function writeData(data: Project[]) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to projects.json', error);
    throw new Error('Failed to update projects in database.');
  }
}

export async function getProjects(): Promise<Project[]> {
  return await readData();
}

export async function addProject(data: Omit<Project, 'id'>) {
    const items = await readData();
    const validation = projectSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newItem: Project = {
        ...validation.data,
        id: Date.now().toString(),
    };

    items.unshift(newItem);
    
    try {
        await writeData(items);
        revalidatePath('/work/projects');
        revalidatePath('/admin/projects');
        return { success: true, item: newItem };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateProject(id: string, data: Omit<Project, 'id'>) {
    const items = await readData();
    const validation = projectSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    const itemIndex = items.findIndex(p => p.id === id);
    if (itemIndex === -1) {
        return { success: false, error: 'Project not found.' };
    }

    const updatedItem = {
        ...items[itemIndex],
        ...validation.data,
    };
    items[itemIndex] = updatedItem;

    try {
        await writeData(items);
        revalidatePath('/work/projects');
        revalidatePath('/admin/projects');
        return { success: true, item: updatedItem };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteProject(id: string) {
    const items = await readData();
    const updatedItems = items.filter(p => p.id !== id);

    if (items.length === updatedItems.length) {
         return { success: false, error: 'Project not found.' };
    }
    
    try {
        await writeData(updatedItems);
        revalidatePath('/work/projects');
        revalidatePath('/admin/projects');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
