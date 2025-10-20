
'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { blogPostSchema, BlogPost } from '@/lib/types';
import slugify from 'slugify';
import { initializeFirebase } from '@/firebase';
import { getAuth } from 'firebase/auth/web-extension';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

async function verifyAdmin() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const admin = getFirebaseAdmin();
    const userRecord = await admin.auth().getUser(user.uid);
    if (userRecord.customClaims?.admin !== true) {
        throw new Error('User is not an admin');
    }
}


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
    try {
        await verifyAdmin();
    } catch (error: any) {
        return { success: false, error: error.message };
    }

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
    try {
        await verifyAdmin();
    } catch (error: any) {
        return { success: false, error: error.message };
    }

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
        await verifyAdmin();
    } catch (error: any) {
        return { success: false, error: error.message };
    }

    try {
        const firestore = await getFirestoreInstance();
        const blogCollectionRef = await getBlogCollection();
        const docRef = doc(firestore, 'blogPosts', id);
        
        // Fetch the document to get the category before deleting
        const postToDelete = (await getDocs(blogCollectionRef)).docs.find(d => d.id === id)?.data();
        
        await deleteDoc(docRef);

        if (postToDelete) {
             revalidatePath(`/blog/${postToDelete.slug}`);
        }
        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
