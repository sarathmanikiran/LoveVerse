import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        return await signInWithPopup(auth, provider);
    } catch (error: any) {
        if (error.code === 'auth/unauthorized-domain') {
            const domain1 = 'ais-dev-k7dusnon3q5vjzkxviv2qd-96989193973.asia-southeast1.run.app';
            const domain2 = 'ais-pre-k7dusnon3q5vjzkxviv2qd-96989193973.asia-southeast1.run.app';
            throw new Error(
              `Firebase Error: Unauthorized domain.\n` +
              `Please add the following domains to your Firebase Project's Authorized Domains in Authentication -> Settings -> Authorized domains:\n` +
              `- ${domain1}\n` +
              `- ${domain2}`
            );
        }
        throw error;
    }
};

export const logout = () => signOut(auth);

// Handle errors
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
    },
    operationType,
    path
  };
  throw new Error(JSON.stringify(errInfo));
}
