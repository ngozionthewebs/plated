import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDNKS-g2_cdE9t-9rb-dOsmz_-r2-8itYU",
  authDomain: "plated-app-dfe0e.firebaseapp.com",
  projectId: "plated-app-dfe0e",
  storageBucket: "plated-app-dfe0e.firebasestorage.app",
  messagingSenderId: "785008564913",
  appId: "1:785008564913:web:f91b5d3de172725ae3a090",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

export default app;