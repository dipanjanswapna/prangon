
'use server';

// This file is kept to avoid breaking imports, but it no longer initializes Firebase Admin.
// All server-side Firestore operations have been replaced with a local JSON file data source.

export const getFirestore = () => {
    throw new Error("Firebase Admin SDK is not configured. Using local JSON file instead.");
};

export const getAuth = () => {
     throw new Error("Firebase Admin SDK is not configured.");
};
