
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { prangonsLikhaPostSchema, PrangonsLikhaPost } from '@/lib/types';
import slugify from 'slugify';

const dataFilePath = path.join(process.cwd(), 'prangons-likha.json');

async function readData(): Promise<PrangonsLikhaPost[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

async function writeData(data: PrangonsLikhaPost[]) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to prangons-likha.json', error);
    throw new Error('Failed to update content in database.');
  }
}

export async function getPrangonsLikhaPosts(): Promise<PrangonsLikhaPost[]> {
  return await readData();
}

export async function addPrangonsLikhaPost(data: Omit<PrangonsLikhaPost, 'id' | 'slug'>) {
    const posts = await readData();
    const validation = prangonsLikhaPostSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newPost: PrangonsLikhaPost = {
        ...validation.data,
        id: Date.now().toString(),
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };

    posts.push(newPost);
    
    try {
        await writeData(posts);
        revalidatePath('/prangons-likha');
        revalidatePath(`/prangons-likha/category/${encodeURIComponent(newPost.category)}`);
        revalidatePath('/admin/prangons-likha');
        return { success: true, post: newPost };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updatePrangonsLikhaPost(id: string, data: Omit<PrangonsLikhaPost, 'id' | 'slug'>) {
    const posts = await readData();
    const validation = prangonsLikhaPostSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
        return { success: false, error: 'Post not found.' };
    }

    const updatedPost = {
        ...posts[postIndex],
        ...validation.data,
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };
    posts[postIndex] = updatedPost;

    try {
        await writeData(posts);
        revalidatePath('/prangons-likha');
        revalidatePath(`/prangons-likha/post/${updatedPost.slug}`);
        revalidatePath(`/prangons-likha/category/${encodeURIComponent(updatedPost.category)}`);
        revalidatePath('/admin/prangons-likha');
        return { success: true, post: updatedPost };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePrangonsLikhaPost(id: string) {
    const posts = await readData();
    const postToDelete = posts.find(p => p.id === id);
    if (!postToDelete) {
      return { success: false, error: 'Post not found.' };
    }

    const updatedPosts = posts.filter(p => p.id !== id);

    if (posts.length === updatedPosts.length) {
         return { success: false, error: 'Post not found.' };
    }
    
    try {
        await writeData(updatedPosts);
        revalidatePath('/prangons-likha');
        revalidatePath(`/prangons-likha/category/${encodeURIComponent(postToDelete.category)}`);
        revalidatePath('/admin/prangons-likha');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
