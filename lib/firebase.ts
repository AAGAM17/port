import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

/* Firestore powers the live testimonial wall. Configuration comes
   from NEXT_PUBLIC_FIREBASE_* env vars (see FIREBASE_SETUP.md);
   when they're absent the site builds and runs fine — testimonial
   submission simply falls back to email. */

const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

let db: Firestore | null = null;

export function getDb(): Firestore | null {
    if (!isFirebaseConfigured) return null;
    if (!db) {
        const app = getApps()[0] ?? initializeApp(config);
        db = getFirestore(app);
    }
    return db;
}
