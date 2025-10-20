
'use server';

import { revalidatePath } from 'next/cache';
import { blogPostSchema, BlogPost } from '@/lib/types';
import slugify from 'slugify';
import admin from '@/lib/firebase-admin';

const getBlogCollection = () => admin.firestore().collection('blogPosts');

export async function getBlogPosts(): Promise<BlogPost[]> {
  const snapshot = await getBlogCollection().orderBy('date', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
}

export async function addBlogPost(data: Omit<BlogPost, 'id' | 'slug'>) {
    const validation = blogPostSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newPostData = {
        ...validation.data,
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };

    try {
        const docRef = await getBlogCollection().add(newPostData);
        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: true, post: { ...newPostData, id: docRef.id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateBlogPost(id: string, data: Omit<BlogPost, 'id' | 'slug'>) {
    const validation = blogPostSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const updatedPostData = {
        ...validation.data,
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };

    try {
        const docRef = getBlogCollection().doc(id);
        await docRef.update(updatedPostData);
        revalidatePath('/blog');
        revalidatePath(`/blog/${updatedPostData.slug}`);
        revalidatePath('/admin/blog');
        return { success: true, post: { ...updatedPostData, id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await getBlogCollection().doc(id).delete();
        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
