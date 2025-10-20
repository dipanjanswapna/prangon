
'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { projectSchema, Project } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const projectsCollection = async () => collection(await getFirestoreInstance(), 'projects');

export async function getProjects(): Promise<Project[]> {
  try {
    const projectsRef = await projectsCollection();
    const snapshot = await getDocs(projectsRef);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
    console.error('Could not read projects collection:', error);
    return [];
  }
}

export async function addProject(data: Omit<Project, 'id'>) {
    const validation = projectSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    try {
        const projectsRef = await projectsCollection();
        const docRef = await addDoc(projectsRef, validation.data);
        revalidatePath('/work/projects');
        revalidatePath('/admin/projects');
        return { success: true, item: { ...validation.data, id: docRef.id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateProject(id: string, data: Omit<Project, 'id'>) {
    const validation = projectSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    try {
        const firestore = await getFirestoreInstance();
        const docRef = doc(firestore, 'projects', id);
        await updateDoc(docRef, validation.data);
        revalidatePath('/work/projects');
        revalidatePath('/admin/projects');
        return { success: true, item: { ...validation.data, id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteProject(id: string) {
    try {
        const firestore = await getFirestoreInstance();
        await deleteDoc(doc(firestore, 'projects', id));
        revalidatePath('/work/projects');
        revalidatePath('/admin/projects');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
