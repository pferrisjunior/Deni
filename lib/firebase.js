// All of this will have to change when we switch to the new Firebase project, but for now this is just a placeholder to get us up and running with the old one. We can also add more Firebase services here as needed (e.g. Firestore, Storage, etc.) and export them for use in other parts of the app.
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeamkIWB8zDrUdGBjXWk06HMvFMh_FjrM",
  authDomain: "deni-auth-dev.firebaseapp.com",
  projectId: "deni-auth-dev",
  storageBucket: "deni-auth-dev.firebasestorage.app",
  messagingSenderId: "202780657934",
  appId: "1:202780657934:web:3a2ee7b6e1e45c7be42f5f"
};

// Initialize Firebase
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const auth = getAuth(app);