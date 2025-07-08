import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBxrY2-_r-FSuqDR6s5XS6vVEK_xVQbr0s",
  authDomain: "librarymanagementsystem1-9adff.firebaseapp.com",
  projectId: "librarymanagementsystem1-9adff",
  storageBucket: "librarymanagementsystem1-9adff.firebasestorage.app",
  messagingSenderId: "941857086573",
  appId: "1:941857086573:web:3ba5e4c58d5efd0a64f364",
  measurementId: "G-4XT3T54XQH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;