// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiz-xlxznw2xe5uN4NTiVmtwgKqUm6HXw",
  authDomain: "gtours-fcd56.firebaseapp.com",
  projectId: "gtours-fcd56",
  storageBucket: "gtours-fcd56.firebasestorage.app",
  messagingSenderId: "285333712299",
  appId: "1:285333712299:web:f1005b9796d4a2b3ecf6ee",
};

// Initialize Firebase
const currentApps = getApps();
let auth: Auth;
let storage: FirebaseStorage;
if (!currentApps.length) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
} else {
  const app = currentApps[0];
  auth = getAuth(app);
  storage = getStorage(app);
}

export { auth, storage };
