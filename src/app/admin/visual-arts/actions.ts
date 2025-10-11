
'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { visualArtSchema, VisualArt } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const visualArtsCollection = async () => collection(await getFirestoreInstance(), 'visualArts');

export async function getVisualArts(): Promise<VisualArt[]> {
  const collectionRef = await visualArtsCollection();
  const q = query(collectionRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisualArt));
}

export async function addVisualArt(data: Omit<VisualArt, 'id'>) {
    const validation = visualArtSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    try {
        const collectionRef = await visualArtsCollection();
        const docRef = await addDoc(collectionRef, validation.data);
        revalidatePath('/visual-arts');
        revalidatePath('/admin/visual-arts');
        return { success: true, item: { ...validation.data, id: docRef.id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateVisualArt(id: string, data: Omit<VisualArt, 'id'>) {
    const validation = visualArtSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    try {
        const firestore = await getFirestoreInstance();
        const docRef = doc(firestore, 'visualArts', id);
        await updateDoc(docRef, validation.data);
        revalidatePath('/visual-arts');
        revalidatePath('/admin/visual-arts');
        return { success: true, item: { ...validation.data, id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteVisualArt(id: string) {
    try {
        const firestore = await getFirestoreInstance();
        await deleteDoc(doc(firestore, 'visualArts', id));
        revalidatePath('/visual-arts');
        revalidatePath('/admin/visual-arts');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
