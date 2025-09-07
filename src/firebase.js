import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDOfkxUAmFxqLIqYxyG6aanYbMZuTI3krA",
  authDomain: "blogsphere-67bf5.firebaseapp.com",
  projectId: "blogsphere-67bf5",
  storageBucket: "blogsphere-67bf5.appspot.com",
  messagingSenderId: "390712781339",
  appId: "1:390712781339:web:33836e69ada15d2810a6be",
  measurementId: "G-V3PKH3BN95"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // must exist if used
export default app
