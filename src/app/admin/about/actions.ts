
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { aboutPageSchema, AboutPageData } from '@/lib/types';
import aboutPageDefaultData from '../../../../about-page-data.json';

const dataFilePath = path.join(process.cwd(), 'data/about-page.json');

// Helper function to read the data file
async function readData(): Promise<AboutPageData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.warn('Could not read about-page.json, returning default data.', error);
    // If the file doesn't exist or is invalid, return the default data from the import
    return aboutPageDefaultData as AboutPageData;
  }
}

// Helper function to write to the data file
async function writeData(data: AboutPageData) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to about-page.json', error);
    throw new Error('Failed to update content in database.');
  }
}

export async function getAboutPageContent(): Promise<AboutPageData> {
  const fileData = await readData();
  return { ...aboutPageDefaultData, ...fileData };
}

export async function updateAboutPageContent(data: AboutPageData) {
  const validation = aboutPageSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten() };
  }

  try {
    await writeData(validation.data);
    revalidatePath('/about');
    revalidatePath('/admin/about');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating about page content:', error);
    return { success: false, error: error.message };
  }
}
