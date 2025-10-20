import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { firebaseConfig } from '@/firebase/config';
import { cookies } from 'next/headers';

function initializeAppIfNeeded() {
    if (!getApps().length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
                databaseURL: `https://${process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId}.firebaseio.com`,
            });
        } catch (error) {
            console.error('Firebase admin initialization error', error);
        }
    }
}

initializeAppIfNeeded();
export const getFirebaseAdmin = () => admin;

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
