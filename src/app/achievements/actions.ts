
'use server';

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Achievement } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const { firestore } = await initializeFirebase();
    const achievementsRef = collection(firestore, 'achievements');
    const q = query(achievementsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Achievement));
  } catch (error) {
    console.error('Could not read achievements collection:', error);
    return [];
  }
}
