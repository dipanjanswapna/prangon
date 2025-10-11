
'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { prangonsLikhaPostSchema, PrangonsLikhaPost } from '@/lib/types';
import slugify from 'slugify';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const prangonsLikhaCollection = async () => collection(await getFirestoreInstance(), 'prangonsLikha');

export async function getPrangonsLikhaPosts(): Promise<PrangonsLikhaPost[]> {
  const collectionRef = await prangonsLikhaCollection();
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrangonsLikhaPost));
}

export async function addPrangonsLikhaPost(data: Omit<PrangonsLikhaPost, 'id' | 'slug'>) {
    const validation = prangonsLikhaPostSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newPostData = {
        ...validation.data,
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };

    try {
        const collectionRef = await prangonsLikhaCollection();
        const docRef = await addDoc(collectionRef, newPostData);
        revalidatePath('/prangons-likha');
        revalidatePath(`/prangons-likha/category/${encodeURIComponent(newPostData.category)}`);
        revalidatePath('/admin/prangons-likha');
        return { success: true, post: { ...newPostData, id: docRef.id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updatePrangonsLikhaPost(id: string, data: Omit<PrangonsLikhaPost, 'id' | 'slug'>) {
    const validation = prangonsLikhaPostSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    const updatedPostData = {
        ...validation.data,
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };

    try {
        const firestore = await getFirestoreInstance();
        const docRef = doc(firestore, 'prangonsLikha', id);
        await updateDoc(docRef, updatedPostData);

        revalidatePath('/prangons-likha');
        revalidatePath(`/prangons-likha/post/${updatedPostData.slug}`);
        revalidatePath(`/prangons-likha/category/${encodeURIComponent(updatedPostData.category)}`);
        revalidatePath('/admin/prangons-likha');
        return { success: true, post: { ...updatedPostData, id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePrangonsLikhaPost(id: string) {
    const firestore = await getFirestoreInstance();
    const docRef = doc(firestore, 'prangonsLikha', id);
    try {
        const postToDelete = (await getDocs(await prangonsLikhaCollection())).docs.find(d => d.id === id)?.data();
        await deleteDoc(docRef);
        if (postToDelete) {
            revalidatePath(`/prangons-likha/category/${encodeURIComponent(postToDelete.category)}`);
        }
        revalidatePath('/prangons-likha');
        revalidatePath('/admin/prangons-likha');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
