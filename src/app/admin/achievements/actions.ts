
'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { achievementSchema, Achievement } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const achievementsCollection = async () => collection(await getFirestoreInstance(), 'achievements');

export async function getAchievements(): Promise<Achievement[]> {
  const achievementsRef = await achievementsCollection();
  const q = query(achievementsRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
}

export async function addAchievement(data: Omit<Achievement, 'id'>) {
    const validation = achievementSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    try {
        const achievementsRef = await achievementsCollection();
        const docRef = await addDoc(achievementsRef, validation.data);
        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true, item: { ...validation.data, id: docRef.id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateAchievement(id: string, data: Omit<Achievement, 'id'>) {
    const validation = achievementSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    try {
        const firestore = await getFirestoreInstance();
        const docRef = doc(firestore, 'achievements', id);
        await updateDoc(docRef, validation.data);
        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true, item: { ...validation.data, id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAchievement(id: string) {
    try {
        const firestore = await getFirestoreInstance();
        await deleteDoc(doc(firestore, 'achievements', id));
        revalidatePath('/achievements');
        revalidatePath('/admin/achievements');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
