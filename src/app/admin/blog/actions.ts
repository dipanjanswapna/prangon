
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { blogPostSchema, BlogPost } from '@/lib/types';
import slugify from 'slugify';

const dataFilePath = path.join(process.cwd(), 'blog.json');

async function readData(): Promise<BlogPost[]> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

async function writeData(data: BlogPost[]) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to blog.json', error);
    throw new Error('Failed to update content in database.');
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return await readData();
}

export async function addBlogPost(data: Omit<BlogPost, 'id' | 'slug'>) {
    const posts = await readData();
    const validation = blogPostSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newPost: BlogPost = {
        ...validation.data,
        id: Date.now().toString(),
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };

    posts.unshift(newPost);
    
    try {
        await writeData(posts);
        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: true, post: newPost };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateBlogPost(id: string, data: Omit<BlogPost, 'id' | 'slug'>) {
    const posts = await readData();
    const validation = blogPostSchema.omit({id: true, slug: true}).safeParse(data);

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
        revalidatePath('/blog');
        revalidatePath(`/blog/${updatedPost.slug}`);
        revalidatePath('/admin/blog');
        return { success: true, post: updatedPost };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteBlogPost(id: string) {
    const posts = await readData();
    const updatedPosts = posts.filter(p => p.id !== id);

    if (posts.length === updatedPosts.length) {
         return { success: false, error: 'Post not found.' };
    }
    
    try {
        await writeData(updatedPosts);
        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
