'use server';

import admin from 'firebase-admin';

let appInitialized = false;

const initializeFirebaseAdmin = () => {
    if (appInitialized) return;

    if (admin.apps.length === 0) {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!serviceAccountJson) {
            console.error('Firebase Admin Init Error: FIREBASE_SERVICE_ACCOUNT env var not set. Skipping initialization.');
            return;
        }

        try {
            let serviceAccount;
            // First, try to parse it as a direct JSON string
            try {
                serviceAccount = JSON.parse(serviceAccountJson);
            } catch (e) {
                // If that fails, assume it's a Base64 encoded string
                console.log('Could not parse service account as raw JSON, attempting Base64 decode...');
                const decodedServiceAccount = Buffer.from(serviceAccountJson, 'base64').toString('utf-8');
                serviceAccount = JSON.parse(decodedServiceAccount);
            }
            
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            appInitialized = true;
            console.log('Firebase Admin SDK initialized successfully.');

        } catch (e: any) {
            console.error('Firebase Admin Init Error: Failed to initialize Firebase Admin SDK.');
            console.error('Original Error:', e.message);
        }
    } else {
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