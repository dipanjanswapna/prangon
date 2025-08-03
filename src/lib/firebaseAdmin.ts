
'use server';

import admin from 'firebase-admin';

let appInitialized = false;

const initializeFirebaseAdmin = () => {
    if (appInitialized) return;

    if (admin.apps.length === 0) {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!serviceAccountJson) {
            console.error('Firebase Admin Init Error: FIREBASE_SERVICE_ACCOUNT env var not set.');
            return;
        }

        try {
            const decodedServiceAccount = Buffer.from(serviceAccountJson, 'base64').toString('utf-8');
            try {
                const serviceAccount = JSON.parse(decodedServiceAccount);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                appInitialized = true;
            } catch (e: any) {
                console.error('Firebase Admin Init Error: Failed to parse service account JSON.');
                console.error('Parsed String (first 50 chars):', decodedServiceAccount.substring(0, 50));
                console.error('Original Error:', e.message);
            }
        } catch (e: any) {
            console.error('Firebase Admin Init Error: Failed to decode Base64 service account.');
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
