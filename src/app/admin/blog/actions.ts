
'use server';

import { revalidatePath } from 'next/cache';
import { blogPostSchema, BlogPost } from '@/lib/types';
import slugify from 'slugify';
import admin from '@/lib/firebase-admin';

const getBlogCollection = () => {
    const firestore = admin.firestore();
    return firestore.collection('blogPosts');
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const blogCollection = getBlogCollection();
  const snapshot = await blogCollection.orderBy('date', 'desc').get();
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
        const blogCollection = getBlogCollection();
        const docRef = await blogCollection.add(newPostData);
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
        const blogCollection = getBlogCollection();
        const docRef = blogCollection.doc(id);
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
        const blogCollection = getBlogCollection();
        await blogCollection.doc(id).delete();
        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
