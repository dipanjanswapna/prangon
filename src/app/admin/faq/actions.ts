
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { faqPageSchema, FAQPageData, FAQItem } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'data/faq.json');

async function readData(): Promise<FAQPageData> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const fileData = JSON.parse(fileContent);
    return {
        faqs: fileData.faqs || [],
    };
  } catch (error) {
    console.warn('Could not read faq.json, returning default data.', error);
    return { faqs: [] };
  }
}

async function writeData(data: FAQPageData) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to faq.json', error);
    throw new Error('Failed to update content in database.');
  }
}

export async function getFAQPageData(): Promise<FAQPageData> {
  const fileData = await readData();
  return { 
    faqs: fileData.faqs || [],
  };
}

export async function updateFAQPageData(data: FAQPageData) {
  const validation = faqPageSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten() };
  }

  try {
    // Add unique IDs to new items
    validation.data.faqs.forEach(item => { if (!item.id) item.id = Date.now().toString() + Math.random().toString(36).substring(2); });

    await writeData(validation.data);
    revalidatePath('/');
    revalidatePath('/admin/faq');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating FAQ page content:', error);
    return { success: false, error: error.message };
  }
}
