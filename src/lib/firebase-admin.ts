
import * as admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import { firebaseConfig } from '@/firebase/config';

let app: App | undefined = undefined;

function initializeAppIfNeeded() {
    if (!admin.apps.length) {
        try {
            // Using service account credentials from environment variables is the standard for production.
            // However, for a simplified setup, we can try to initialize with what we have.
            // This setup assumes you are running in an environment where ADC (Application Default Credentials)
            // are configured, or you are using the emulator.
            // For local development without a service account file, this will rely on ADC.
             const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

            if (process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
                 app = admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: privateKey,
                    }),
                });
            } else {
                // Fallback for environments without full service account details in env vars
                 app = admin.initializeApp({
                    projectId: firebaseConfig.projectId,
                 });
            }

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

export default {
    ...admin,
    initializeApp: (): App => {
       initializeAppIfNeeded();
       if (!app) throw new Error("Firebase Admin SDK failed to initialize.");
       return app;
    },
    firestore: (): admin.firestore.Firestore => {
        const adminApp = getFirebaseAdmin();
        return adminApp.firestore();
    },
    auth: (): admin.auth.Auth => {
        const adminApp = getFirebaseAdmin();
        return adminApp.auth();
    }
};
