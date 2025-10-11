
'use server';

import { collection, getDocs } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

async function getCount(collectionName: string): Promise<number> {
    try {
        const { firestore } = await initializeFirebase();
        const colRef = collection(firestore, collectionName);
        const snapshot = await getDocs(colRef);
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

