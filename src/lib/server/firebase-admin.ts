import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getCookie, getRequestHeader } from '@tanstack/react-start/server';
import firebaseConfig from '../../../firebase-applet-config.json';

const apps = getApps();


if (!apps.length) {
  initializeApp({
    projectId: firebaseConfig.projectId
  });
}


export const adminDb = getFirestore(firebaseConfig.firestoreDatabaseId || "(default)");
export const adminAuth = getAuth();

export async function requireAuth(): Promise<string> {
  
  const authHeader = getRequestHeader('authorization') || getRequestHeader('Authorization');
  let idToken = getCookie("fb_token");
  if (!idToken && authHeader && authHeader.startsWith("Bearer ")) {
    idToken = authHeader.substring(7);
  }
  if (!idToken) {
    throw new Error("Unauthorized: missing token");
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    throw new Error("Unauthorized: invalid token");
  }
}
