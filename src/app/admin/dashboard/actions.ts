
'use server';

import admin from '@/lib/firebase-admin';

async function getCount(collectionName: string): Promise<number> {
    try {
        const snapshot = await admin.firestore().collection(collectionName).get();
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
