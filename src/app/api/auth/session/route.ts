
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const authorization = request.headers.get('Authorization');
    if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1];
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        
        try {
            const admin = getFirebaseAdmin();
            const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
            cookies().set('__session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
            return NextResponse.json({ status: 'success' });
        } catch (error) {
            console.error("Session cookie creation failed:", error);
            return NextResponse.json({ status: 'error', message: 'Failed to create session' }, { status: 401 });
        }
    }
    return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
}
