
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { socialWorkPageSchema, SocialWorkPageData } from '@/lib/types';
import defaultData from '@/../social-work.json';

const dataFilePath = path.join(process.cwd(), 'social-work.json');

async function readData(): Promise<SocialWorkPageData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.warn('Could not read social-work.json, returning default data.', error);
    return defaultData as SocialWorkPageData;
  }
}

async function writeData(data: SocialWorkPageData) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to social-work.json', error);
    throw new Error('Failed to update content in database.');
  }
}

export async function getSocialWorkPageData(): Promise<SocialWorkPageData> {
  const fileData = await readData();
  return { ...defaultData, ...fileData };
}

export async function updateSocialWorkPageData(data: SocialWorkPageData) {
  const validation = socialWorkPageSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten() };
  }

  try {
    // Add unique IDs to new items
    validation.data.initiatives.forEach(item => { if (!item.id) item.id = Date.now().toString() + Math.random(); });
    validation.data.testimonials.forEach(item => { if (!item.id) item.id = Date.now().toString() + Math.random(); });

    await writeData(validation.data);
    revalidatePath('/social-work');
    revalidatePath('/admin/social-work');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating social work page content:', error);
    return { success: false, error: error.message };
  }
}
