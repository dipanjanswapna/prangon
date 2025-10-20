
'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { subscriptionPlanSchema, SubscriptionPlan } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const subscriptionsCollection = async () => collection(await getFirestoreInstance(), 'subscriptionPlans');

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const collectionRef = await subscriptionsCollection();
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubscriptionPlan));
  } catch (error) {
      console.error("Could not read subscriptionPlans collection:", error);
      return [];
  }
}

export async function addSubscriptionPlan(data: Omit<SubscriptionPlan, 'id'>) {
    const validation = subscriptionPlanSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }
    
    try {
        const collectionRef = await subscriptionsCollection();
        const docRef = await addDoc(collectionRef, validation.data);
        revalidatePath('/subscribe');
        revalidatePath('/admin/subscriptions');
        return { success: true, plan: { ...validation.data, id: docRef.id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateSubscriptionPlan(id: string, data: Omit<SubscriptionPlan, 'id'>) {
    const validation = subscriptionPlanSchema.omit({id: true}).safeParse(data);

    if (!validation.success) {
        return { success: false, error: validation.error.flatten() };
    }

    try {
        const firestore = await getFirestoreInstance();
        const docRef = doc(firestore, 'subscriptionPlans', id);
        await updateDoc(docRef, validation.data);
        revalidatePath('/subscribe');
        revalidatePath('/admin/subscriptions');
        return { success: true, plan: { ...validation.data, id } };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteSubscriptionPlan(id: string) {
    try {
        const firestore = await getFirestoreInstance();
        await deleteDoc(doc(firestore, 'subscriptionPlans', id));
        revalidatePath('/subscribe');
        revalidatePath('/admin/subscriptions');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
