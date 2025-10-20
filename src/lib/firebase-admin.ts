
import * as admin from 'firebase-admin';
import { cookies } from 'next/headers';
import { firebaseConfig } from '@/firebase/config';

function initializeAppIfNeeded() {
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: firebaseConfig.projectId,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
        } catch (error) {
            console.error('Firebase admin initialization error', error);
        }
    }
}

initializeAppIfNeeded();

export const getFirebaseAdmin = () => {
    if (!admin.apps.length) {
        initializeAppIfNeeded();
    }
    return admin;
};

export const verifyIsAdmin = async () => {
    const admin = getFirebaseAdmin();
    const session = cookies().get('__session')?.value || '';

    if (!session) {
        throw new Error('User not authenticated.');
    }

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(session, true);
        if (decodedClaims.admin !== true) {
            throw new Error('User is not an admin.');
        }
        return decodedClaims;
    } catch (error) {
        console.error('Admin verification failed:', error);
        throw new Error('Could not verify admin status.');
    }
};

export const setAdminClaim = async (uid: string) => {
    const adminApp = getFirebaseAdmin();
    await adminApp.auth().setCustomUserClaims(uid, { admin: true });
};
