
'use server';

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { BlogPost } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { firestore } = await initializeFirebase();
    const blogRef = collection(firestore, 'blogPosts');
    const q = query(blogRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  } catch (error) {
    console.error('Could not read blogPosts collection:', error);
    return [];
  }
}
