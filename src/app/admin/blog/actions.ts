
'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { blogPostSchema, BlogPost } from '@/lib/types';
import slugify from 'slugify';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const getBlogCollection = async () => collection(await getFirestoreInstance(), 'blogPosts');


export async function getBlogPosts(): Promise<BlogPost[]> {
  const blogCollectionRef = await getBlogCollection();
  const snapshot = await getDocs(query(blogCollectionRef, orderBy('date', 'desc')));
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
        const blogCollectionRef = await getBlogCollection();
        const docRef = await addDoc(blogCollectionRef, newPostData);
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
        const firestore = await getFirestoreInstance();
        const docRef = doc(firestore, 'blogPosts', id);
        await updateDoc(docRef, updatedPostData);
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
        const firestore = await getFirestoreInstance();
        await deleteDoc(doc(firestore, 'blogPosts', id));
        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
