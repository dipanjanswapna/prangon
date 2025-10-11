
'use server';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { paymentSettingsSchema, PaymentSettings } from '@/lib/types';
import { initializeFirebase } from '@/firebase';

async function getFirestoreInstance() {
  const { firestore } = await initializeFirebase();
  return firestore;
}

const docRef = async () => doc(await getFirestoreInstance(), 'settings', 'payment');

const defaultSettings: PaymentSettings = {
    card: { enabled: true },
    paypal: { enabled: true },
    mobile: { enabled: true },
    bkash: { enabled: true },
    nagad: { enabled: true },
    upi: { enabled: false },
};

export async function getPaymentSettings(): Promise<PaymentSettings> {
  try {
    const reference = await docRef();
    const docSnap = await getDoc(reference);
    if (docSnap.exists()) {
      // Merge with defaults to ensure new settings are included
      return { ...defaultSettings, ...docSnap.data() };
    }
  } catch(e) {
    console.error("Failed to fetch payment settings:", e);
  }
  return defaultSettings;
}

export async function updatePaymentSettings(data: PaymentSettings) {
  const validation = paymentSettingsSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten() };
  }

  try {
    const reference = await docRef();
    await setDoc(reference, validation.data, { merge: true });
    revalidatePath('/admin/settings');
    revalidatePath('/checkout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
