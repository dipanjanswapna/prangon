
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { SocialWorkPageData } from '@/lib/types';
import defaultData from '@/../social-work.json';

const dataFilePath = path.join(process.cwd(), 'social-work.json');

// Helper function to read the data file
async function readData(): Promise<SocialWorkPageData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const fileData = JSON.parse(fileContent);
    // Ensure both initiatives and testimonials arrays exist
    return {
        initiatives: fileData.initiatives || [],
        testimonials: fileData.testimonials || [],
    };
  } catch (error) {
    console.warn('Could not read social-work.json, returning default data.', error);
    return defaultData as SocialWorkPageData;
  }
}

export async function getSocialWorkPageData(): Promise<SocialWorkPageData> {
  const fileData = await readData();
  // Merge with default to ensure structure is correct, though readData should handle it.
  return { 
    initiatives: fileData.initiatives || defaultData.initiatives,
    testimonials: fileData.testimonials || defaultData.testimonials
  };
}
