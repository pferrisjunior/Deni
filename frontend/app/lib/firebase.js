// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)