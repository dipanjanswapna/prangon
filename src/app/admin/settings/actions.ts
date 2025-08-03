
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { paymentSettingsSchema, PaymentSettings } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'payment-settings.json');

const defaultSettings: PaymentSettings = {
    card: { enabled: true },
    paypal: { enabled: true },
    mobile: { enabled: true },
    bkash: { enabled: true },
    nagad: { enabled: true },
    upi: { enabled: false },
};

async function readData(): Promise<PaymentSettings> {
  try {
    await fs.access(dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const parsed = JSON.parse(fileContent);
    // Merge with defaults to ensure new settings are included
    return { ...defaultSettings, ...parsed };
  } catch (error) {
    // If file doesn't exist or is invalid, return default settings
    return defaultSettings;
  }
}

async function writeData(data: PaymentSettings) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf-8');
  } catch (error) {
    console.error('Failed to write to payment-settings.json', error);
    throw new Error('Failed to update payment settings in database.');
  }
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  return await readData();
}

export async function updatePaymentSettings(data: PaymentSettings) {
  const validation = paymentSettingsSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten() };
  }

  try {
    await writeData(validation.data);
    revalidatePath('/admin/settings');
    revalidatePath('/checkout');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
