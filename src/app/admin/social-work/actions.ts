
'use server';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { socialWorkPageSchema, SocialWorkPageData } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const docRef = async () => doc(await getFirestoreInstance(), 'pages', 'socialWork');

export async function getSocialWorkPageData(): Promise<SocialWorkPageData> {
  try {
    const reference = await docRef();
    const docSnap = await getDoc(reference);
    if (docSnap.exists()) {
      const validation = socialWorkPageSchema.safeParse(docSnap.data());
      if(validation.success) {
          return validation.data;
      }
    }
    // If no data, or data is invalid, return default.
    return { initiatives: [], testimonials: [] };
  } catch (error) {
    console.warn('Could not read social-work data, returning default data.', error);
    return { initiatives: [], testimonials: [] };
  }
}

export async function updateSocialWorkPageData(data: SocialWorkPageData) {
  const validation = socialWorkPageSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten() };
  }

  try {
    const dataWithIds = {
        initiatives: validation.data.initiatives.map(item => ({ ...item, id: item.id || Date.now().toString() + Math.random() })),
        testimonials: validation.data.testimonials.map(item => ({ ...item, id: item.id || Date.now().toString() + Math.random() })),
    };
    
    const reference = await docRef();
    await setDoc(reference, dataWithIds, { merge: true });

    revalidatePath('/social-work');
    revalidatePath('/admin/social-work');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating social work page content:', error);
    return { success: false, error: error.message };
  }
}
