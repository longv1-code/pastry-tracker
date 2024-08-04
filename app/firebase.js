// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQl-6GIHeUd6JyyiAeQAhksymb-GFGjew",
  authDomain: "inventory-management-2023f.firebaseapp.com",
  projectId: "inventory-management-2023f",
  storageBucket: "inventory-management-2023f.appspot.com",
  messagingSenderId: "169490910320",
  appId: "1:169490910320:web:36a1e9ad576cb57007b8b5",
  measurementId: "G-2KYVJT1E29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}