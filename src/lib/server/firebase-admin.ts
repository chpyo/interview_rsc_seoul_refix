import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { getCookie, getRequestHeader } from "@tanstack/react-start/server";
import firebaseConfig from "../../../firebase-applet-config.json";

const apps = getApps();


if (!apps.length) {
  initializeApp({
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
  });
}


export const adminDb = getFirestore(firebaseConfig.firestoreDatabaseId || "(default)");
export const adminAuth = getAuth();

export async function downloadUserAudio(path: string): Promise<Uint8Array> {
  const bucket = getStorage().bucket(firebaseConfig.storageBucket);
  const [buf] = await bucket.file(path).download();
  return new Uint8Array(buf);
}

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
