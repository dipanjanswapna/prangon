import 'dotenv/config';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountJson) {
      throw new Error(
        'The FIREBASE_SERVICE_ACCOUNT environment variable is not set.'
      );
    }
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error', error);
  }
}

const getFirestore = () => {
    if (!admin.apps.length) {
        throw new Error("Firebase Admin SDK has not been initialized.");
    }
    return admin.firestore();
};

const getAuth = () => {
    if (!admin.apps.length) {
        throw new Error("Firebase Admin SDK has not been initialized.");
    }
    return admin.auth();
};


export const firestore = getFirestore();
export const auth = getAuth();
export default admin;
