
'use server';

import { doc, getDoc } from 'firebase/firestore';
import { SocialWorkPageData, socialWorkPageSchema } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

const defaultData: SocialWorkPageData = {
  initiatives: [],
  testimonials: [],
};

export async function getSocialWorkPageData(): Promise<SocialWorkPageData> {
  try {
    const { firestore } = await initializeFirebase();
    const docRef = doc(firestore, 'pages', 'socialWork');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const validation = socialWorkPageSchema.safeParse(docSnap.data());
      if (validation.success) {
        return validation.data;
      }
      console.warn("Invalid social work page data in Firestore.", validation.error);
    }
  } catch (error) {
    console.error('Could not read social work page data:', error);
  }
  return defaultData;
}
