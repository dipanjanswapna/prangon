import "dotenv/config";
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountJson) {
        throw new Error("The FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
    }
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error', error);
  }
}

export const firestore = admin.firestore();
export const auth = admin.auth();
export default admin;
