
'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { experienceSchema, Experience } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const experiencesCollection = async () => collection(await getFirestoreInstance(), 'experiences');

export async function getExperiences(): Promise<Experience[]> {
  const experiencesRef = await experiencesCollection();
  // Firestore doesn't support ordering by a derived value.
  // Sorting will be done on the client if necessary, or we store a start date.
  // For now, let's just fetch without a specific order.
  const snapshot = await getDocs(experiencesRef);
  let experiences = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
  
  // Sort by period in memory
  experiences.sort((a, b) => {
    const aYear = a.period.split(' - ')[0].trim().split(' ').pop() || '0';
    const bYear = b.period.split(' - ')[0].trim().split(' ').pop() || '0';
    return parseInt(bYear) - parseInt(aYear);
  });

  return experiences;
}

export async function addExperience(data: Omit<Experience, 'id'>) {
    const validation = experienceSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    try {
        const experiencesRef = await experiencesCollection();
        const docRef = await addDoc(experiencesRef, validation.data);
        revalidatePath('/experiences');
        revalidatePath('/admin/experiences');
        return { success: true, item: { ...validation.data, id: docRef.id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateExperience(id: string, data: Omit<Experience, 'id'>) {
    const validation = experienceSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    try {
        const firestore = await getFirestoreInstance();
        const docRef = doc(firestore, 'experiences', id);
        await updateDoc(docRef, validation.data);
        revalidatePath('/experiences');
        revalidatePath('/admin/experiences');
        return { success: true, item: { ...validation.data, id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteExperience(id: string) {
    try {
        const firestore = await getFirestoreInstance();
        await deleteDoc(doc(firestore, 'experiences', id));
        revalidatePath('/experiences');
        revalidatePath('/admin/experiences');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
