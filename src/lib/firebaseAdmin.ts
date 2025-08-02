
'use server';

import 'dotenv/config';
import admin from 'firebase-admin';

let appInitialized = false;

const initializeFirebaseAdmin = () => {
    if (appInitialized) return;

    if (admin.apps.length === 0) {
        try {
            const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
            if (!serviceAccountJson) {
                throw new Error(
                    'The FIREBASE_SERVICE_ACCOUNT environment variable is not set.'
                );
            }
            
            // Decode the Base64 service account
            const decodedServiceAccount = Buffer.from(serviceAccountJson, 'base64').toString('utf-8');
            const serviceAccount = JSON.parse(decodedServiceAccount);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            appInitialized = true;
        } catch (error) {
            console.error('Firebase Admin Initialization Error:', error);
            // We don't set appInitialized to true if there's an error
        }
    } else {
        appInitialized = true;
    }
};

const getFirestore = () => {
    initializeFirebaseAdmin();
    if (!admin.apps.length) {
        throw new Error("Firebase Admin SDK could not be initialized.");
    }
    return admin.firestore();
};

const getAuth = () => {
    initializeFirebaseAdmin();
    if (!admin.apps.length) {
        throw new Error("Firebase Admin SDK could not be initialized.");
    }
    return admin.auth();
};

export { getFirestore, getAuth };
