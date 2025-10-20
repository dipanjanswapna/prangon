
'use server';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { faqPageSchema, FAQPageData } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const docRef = async () => doc(await getFirestoreInstance(), 'pages', 'faq');

export async function getFAQPageData(): Promise<FAQPageData> {
  try {
    const reference = await docRef();
    const docSnap = await getDoc(reference);
    if (docSnap.exists()) {
      const validation = faqPageSchema.safeParse(docSnap.data());
      if (validation.success) {
          return validation.data;
      }
    }
    return { faqs: [] };
  } catch (error) {
    console.warn('Could not read FAQ data, returning default data.', error);
    return { faqs: [] };
  }
}

export async function updateFAQPageData(data: FAQPageData) {
  const validation = faqPageSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten() };
  }

  try {
    const dataWithIds = {
        ...validation.data,
        faqs: validation.data.faqs.map(item => ({...item, id: item.id || Date.now().toString() + Math.random().toString(36).substring(2)}))
    }
    const reference = await docRef();
    await setDoc(reference, dataWithIds, { merge: true });
    revalidatePath('/');
    revalidatePath('/admin/faq');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating FAQ page content:', error);
    return { success: false, error: error.message };
  }
}
