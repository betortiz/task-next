import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJELZgcy6RqB71tO3DKxyqrqiOED8X9EY",
  authDomain: "tarefasplus-e9ff8.firebaseapp.com",
  projectId: "tarefasplus-e9ff8",
  storageBucket: "tarefasplus-e9ff8.appspot.com",
  messagingSenderId: "488609251088",
  appId: "1:488609251088:web:6daa2ff6613356d88f2f95"
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

