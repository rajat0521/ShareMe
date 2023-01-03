// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqE433CMUzx7u4iDqJV_z0VCSFf_z-ciE",
  authDomain: "shareme-a027c.firebaseapp.com",
  projectId: "shareme-a027c",
  storageBucket: "shareme-a027c.appspot.com",
  messagingSenderId: "967085526814",
  appId: "1:967085526814:web:8648554644d7d02517830f",
  measurementId: "G-WQCF9FE0M1"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const stortage = firebase.storage;


export { auth, provider, stortage };
export default db;