import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD49kSvT917vuYocfyLGMsEl_5WkSp3xsA",
  authDomain: "aisha-87db7.firebaseapp.com",
  projectId: "aisha-87db7",
  storageBucket: "aisha-87db7.appspot.com",
  messagingSenderId: "955535520390",
  appId: "1:955535520390:web:841b925548612aa2985707",
  measurementId: "G-EWWJFKVCK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics may fail in Node environments; guard if needed
try {
  getAnalytics(app);
} catch {
  // analytics not available in this environment
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const facebookProvider = new FacebookAuthProvider();