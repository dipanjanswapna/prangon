
'use server';

import { promises as fs } from 'fs';
import path from 'path';

async function readFile(filePath: string): Promise<any[]> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    await fs.access(fullPath);
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Could not read ${filePath}:`, error);
    return [];
  }
}

export async function getDashboardStats() {
  const [
    blogPosts,
    projects,
    libraryItems,
    subscriptionPlans
  ] = await Promise.all([
    readFile('blog.json'),
    readFile('projects.json'),
    readFile('library.json'),
    readFile('subscriptions.json')
  ]);

  return {
    totalBlogPosts: blogPosts.length,
    totalProjects: projects.length,
    totalLibraryItems: libraryItems.length,
    totalSubscriptionPlans: subscriptionPlans.length,
  };
}
