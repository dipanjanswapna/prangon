
import * as admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

let app: App | undefined = undefined;

function initializeAppIfNeeded() {
    if (!admin.apps.length) {
        try {
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

            if (!process.env.FIREBASE_PROJECT_ID) {
                throw new Error('FIREBASE_PROJECT_ID is not set.');
            }
            if (!process.env.FIREBASE_CLIENT_EMAIL) {
                throw new Error('FIREBASE_CLIENT_EMAIL is not set.');
            }
            if (!privateKey) {
                throw new Error('FIREBASE_PRIVATE_KEY is not set.');
            }

            app = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
            });
        } catch (error) {
            console.error('Firebase admin initialization error', error);
            // We don't want to throw here, as it might crash the server.
            // Let the caller handle the case where admin is not initialized.
        }
    } else {
        app = admin.apps[0]!;
    }
}

// Initialize on module load
initializeAppIfNeeded();


export const getFirebaseAdmin = () => {
    if (!app) {
        // This case should ideally not happen if environment variables are set correctly,
        // but it's a safeguard.
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
    initializeApp: () => {
       initializeAppIfNeeded();
       return app;
    },
    firestore: () => {
        const adminApp = getFirebaseAdmin();
        return adminApp.firestore();
    },
    auth: () => {
        const adminApp = getFirebaseAdmin();
        return adminApp.auth();
    }
};
