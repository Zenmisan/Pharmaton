import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpjZUdMfHG-acwstJGyA9E-H0SjSKM8Pg",
  authDomain: "zentribe-e8ba2.firebaseapp.com",
  projectId: "zentribe-e8ba2",
  storageBucket: "zentribe-e8ba2.firebasestorage.app",
  messagingSenderId: "757472447742",
  appId: "1:757472447742:web:90e297327110b2444d29af",
  measurementId: "G-NE4P9Q1BQJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
