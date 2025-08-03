
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { homePageSchema, HomePageData } from '@/lib/types';
import defaultData from '@/lib/home-page-data.json';

const dataFilePath = path.join(process.cwd(), 'src/lib/home-page-data.json');

// Helper function to read the data file
async function readData(): Promise<HomePageData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.warn('Could not read home-page-data.json, returning default data.', error);
    // If the file doesn't exist or is invalid, return the default data from the import
    return defaultData as HomePageData;
  }
}

// Helper function to write to the data file
async function writeData(data: HomePageData) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to home-page-data.json', error);
    throw new Error('Failed to update content in database.');
  }
}

export async function getHomePageContent(): Promise<HomePageData> {
  // Always read the latest data from the file
  const fileData = await readData();
  // We can still merge with default data to ensure all keys are present,
  // though reading from a controlled file makes this less critical.
  return { ...defaultData, ...fileData };
}

export async function updateHomePageContent(data: HomePageData) {
  const validation = homePageSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten() };
  }

  try {
    await writeData(validation.data);
    revalidatePath('/');
    revalidatePath('/admin/home');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating home page content:', error);
    return { success: false, error: error.message };
  }
}
