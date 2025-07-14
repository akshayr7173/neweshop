// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEln7ERYoQMEp1dG7EeFogpvV6c8okDZo",
  authDomain: "ecom-2dc12.firebaseapp.com",
  projectId: "ecom-2dc12",
  storageBucket: "ecom-2dc12.firebasestorage.app",
  messagingSenderId: "700135794269",
  appId: "1:700135794269:web:18cc8f2012bbd7f828cfb4",
  measurementId: "G-66DLW3V8B0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, googleProvider, signInWithPopup };
export default app;