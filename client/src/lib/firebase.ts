import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  type User 
} from "firebase/auth";

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  throw new Error("Missing Firebase API Key");
}

if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
  throw new Error("Missing Firebase Project ID");
}

if (!import.meta.env.VITE_FIREBASE_APP_ID) {
  throw new Error("Missing Firebase App ID");
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Add debug logging for config issues
console.log("Initializing Firebase with config:", {
  ...firebaseConfig,
  apiKey: "HIDDEN" // Don't log the API key
});

console.log("Initializing Firebase with config:", {
  ...firebaseConfig,
  apiKey: "HIDDEN"
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Authentication
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    console.log("Attempting Google sign in");
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign in successful");
    return result.user;
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
}

// Sign out
export async function signOutUser() {
  try {
    console.log("Attempting sign out");
    await signOut(auth);
    console.log("Sign out successful");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

// Auth state observer
export function onAuthStateChange(callback: (user: User | null) => void) {
  console.log("Setting up auth state observer");
  return onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user ? "User logged in" : "User logged out");
    callback(user);
  });
}

export { auth };
export type { User };
