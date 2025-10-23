// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQUCaLQduS9WHgYgSsqNA6GukcQu7nerU",
  authDomain: "totk-force-item-battle-test.firebaseapp.com",
  projectId: "totk-force-item-battle-test",
  storageBucket: "totk-force-item-battle-test.firebasestorage.app",
  messagingSenderId: "1058753844279",
  appId: "1:1058753844279:web:530c38efcf6c14080ddbb2",
  measurementId: "G-WQE6N7SYGQ"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);

// Firestore (Datenbank) exportieren
export const db = getFirestore(app);
