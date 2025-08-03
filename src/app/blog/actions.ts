
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { BlogPost } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'blog.json');

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const posts: BlogPost[] = JSON.parse(fileContent);
    // Sort posts by date, newest first
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Could not read blog.json:', error);
    return [];
  }
}
