
'use server';

import admin from 'firebase-admin';

// This flag is now unused but kept for potential future re-enabling.
let appInitialized = false;

const initializeFirebaseAdmin = () => {
  // The initialization logic has been removed to prevent fatal runtime errors
  // due to the persistent authentication issue.
  if (admin.apps.length > 0) {
    appInitialized = true;
    return;
  }
  // Silently fail for now.
  appInitialized = false;
};


const getFirestore = () => {
    initializeFirebaseAdmin();
    if (!appInitialized || admin.apps.length === 0) {
        // Throw a specific error that can be handled by the calling functions.
        // This prevents the entire application from crashing.
        throw new Error("Firebase Admin SDK is not configured. Admin features are disabled.");
    }
    return admin.firestore();
};

const getAuth = () => {
    initializeFirebaseAdmin();
     if (!appInitialized || admin.apps.length === 0) {
        throw new Error("Firebase Admin SDK is not configured. Admin features are disabled.");
    }
    return admin.auth();
};

export { getFirestore, getAuth };
