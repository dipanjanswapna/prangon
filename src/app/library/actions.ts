
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { LibraryItem } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'public/library.json');

export async function getLibraryItems(): Promise<LibraryItem[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Could not read library.json:', error);
    return [];
  }
}
