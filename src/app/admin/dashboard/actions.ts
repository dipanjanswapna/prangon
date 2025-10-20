
'use server';

import { collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

async function getCount(collectionName: string): Promise<number> {
    try {
        const firestore = await getFirestoreInstance();
        const collectionRef = collection(firestore, collectionName);
        const snapshot = await getDocs(collectionRef);
        return snapshot.size;
    } catch (error) {
        console.error(`Could not read collection ${collectionName}:`, error);
        return 0;
    }
}


export async function getDashboardStats() {
  const [
    totalBlogPosts,
    totalProjects,
    totalLibraryItems,
    totalSubscriptionPlans
  ] = await Promise.all([
    getCount('blogPosts'),
    getCount('projects'),
    getCount('libraryItems'),
    getCount('subscriptionPlans'),
  ]);

  return {
    totalBlogPosts,
    totalProjects,
    totalLibraryItems,
    totalSubscriptionPlans,
  };
}
