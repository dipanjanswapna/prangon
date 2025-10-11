
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { Achievement } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'data/achievements.json');

export async function getAchievements(): Promise<Achievement[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Could not read achievements.json:', error);
    return [];
  }
}
