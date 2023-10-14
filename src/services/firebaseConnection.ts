import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmGS0_KBVhu66i2Gj8XpxyARG8A8x7P5M",
  authDomain: "devlink-2a3c5.firebaseapp.com",
  projectId: "devlink-2a3c5",
  storageBucket: "devlink-2a3c5.appspot.com",
  messagingSenderId: "1572714822",
  appId: "1:1572714822:web:4a302a4d7b5178ba2a8d47",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
