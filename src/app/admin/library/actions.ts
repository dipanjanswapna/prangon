
'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { libraryItemSchema, LibraryItem } from '@/lib/types';
import slugify from 'slugify';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const libraryCollection = async () => collection(await getFirestoreInstance(), 'libraryItems');

export async function getLibraryItems(): Promise<LibraryItem[]> {
  try {
    const libraryRef = await libraryCollection();
    const snapshot = await getDocs(libraryRef);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LibraryItem));
  } catch (error) {
    console.error('Could not read libraryItems collection:', error);
    return [];
  }
}

export async function addLibraryItem(data: Omit<LibraryItem, 'id' | 'slug'>) {
    const validation = libraryItemSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    const newItemData = {
        ...validation.data,
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };

    try {
        const libraryRef = await libraryCollection();
        const docRef = await addDoc(libraryRef, newItemData);
        revalidatePath('/library');
        revalidatePath('/admin/library');
        return { success: true, item: { ...newItemData, id: docRef.id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateLibraryItem(id: string, data: Omit<LibraryItem, 'id' | 'slug'>) {
    const validation = libraryItemSchema.omit({id: true, slug: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    const updatedItemData = {
        ...validation.data,
        slug: slugify(validation.data.title, { lower: true, strict: true }),
    };

    try {
        const firestore = await getFirestoreInstance();
        const docRef = doc(firestore, 'libraryItems', id);
        await updateDoc(docRef, updatedItemData);
        revalidatePath('/library');
        revalidatePath(`/library/${updatedItemData.slug}`);
        revalidatePath('/admin/library');
        return { success: true, item: { ...updatedItemData, id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteLibraryItem(id: string) {
    try {
        const firestore = await getFirestoreInstance();
        await deleteDoc(doc(firestore, 'libraryItems', id));
        revalidatePath('/library');
        revalidatePath('/admin/library');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
