import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAcem8gOCMhK5e9yCjKUbP5bwuaT_jpSSs",
  authDomain: "sell-app-970cd.firebaseapp.com",
  databaseURL:
    "https://sell-app-970cd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sell-app-970cd",
  storageBucket: "sell-app-970cd.appspot.com",
  messagingSenderId: "659367826447",
  appId: "1:659367826447:web:03dc98d9cc95518802bf7a",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export { auth, firestore, storage };
