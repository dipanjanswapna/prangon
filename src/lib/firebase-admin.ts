
import * as admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import { firebaseConfig } from '@/firebase/config';

let app: App | undefined = undefined;

function initializeAppIfNeeded() {
    if (!admin.apps.length) {
        try {
            app = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
                ...firebaseConfig
            });
        } catch (error) {
            console.error('Firebase admin initialization error', error);
        }
    } else {
        app = admin.apps[0]!;
    }
}

// Initialize on module load
initializeAppIfNeeded();


export const getFirebaseAdmin = (): App => {
    if (!app) {
        initializeAppIfNeeded();
        if (!app) {
            throw new Error("Firebase Admin SDK could not be initialized. Check server logs for details.");
        }
    }
    return app;
};

export const setAdminClaim = async (uid: string) => {
    const adminApp = getFirebaseAdmin();
    await adminApp.auth().setCustomUserClaims(uid, { admin: true });
};
