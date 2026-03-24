// All of this will have to change when we switch to the new Firebase project, but for now this is just a placeholder to get us up and running with the old one. We can also add more Firebase services here as needed (e.g. Firestore, Storage, etc.) and export them for use in other parts of the app.

// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC54zXo5cbFtNYfhL2jvYnWWL6FE458RBU",
  authDomain: "deni-f1653.firebaseapp.com",
  databaseURL: "https://deni-f1653-default-rtdb.firebaseio.com",
  projectId: "deni-f1653",
  storageBucket: "deni-f1653.firebasestorage.app",
  messagingSenderId: "638018823842",
  appId: "1:638018823842:web:16943d2a7fc27e0cf699fb"
};

// Initialize Firebase (This does not change!!!! do NOT modify.)
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const auth = getAuth(app);
export const db = getDatabase(app);