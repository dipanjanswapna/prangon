
'use server';

import admin from 'firebase-admin';

let appInitialized = false;

const initializeFirebaseAdmin = () => {
    if (appInitialized) return;

    // Check if the SDK has already been initialized
    if (admin.apps.length === 0) {
        try {
            // When running on Google Cloud (like Firebase App Hosting),
            // the SDK can automatically discover the service account credentials.
            // No need to parse a JSON key from an env var.
            admin.initializeApp();
            appInitialized = true;
            console.log('Firebase Admin SDK initialized successfully using Application Default Credentials.');
        } catch (e: any) {
            console.error('Firebase Admin Init Error: Failed to initialize Firebase Admin SDK.');
            console.error('This might be because the server is not running in a Google Cloud environment or the required credentials are not set.');
            console.error('Original Error:', e.message);
        }
    } else {
        // App is already initialized
        appInitialized = true;
    }
};

const getFirestore = () => {
    initializeFirebaseAdmin();
    if (!appInitialized || !admin.apps.length) {
        throw new Error("Firebase Admin SDK could not be initialized.");
    }
    return admin.firestore();
};

const getAuth = () => {
    initializeFirebaseAdmin();
    if (!appInitialized || !admin.apps.length) {
        throw new Error("Firebase Admin SDK could not be initialized.");
    }
    return admin.auth();
};

export { getFirestore, getAuth };
