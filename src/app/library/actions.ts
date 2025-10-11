
'use server';

import { collection, getDocs } from 'firebase/firestore';
import { LibraryItem } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

export async function getLibraryItems(): Promise<LibraryItem[]> {
  try {
    const { firestore } = await initializeFirebase();
    const libraryRef = collection(firestore, 'libraryItems');
    const snapshot = await getDocs(libraryRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LibraryItem));
  } catch (error) {
    console.error('Could not read libraryItems collection:', error);
    return [];
  }
}
