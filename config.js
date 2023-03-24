import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { collection, addDoc, getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBRV7P38AoI0ivy2Ce6lcGFMnj2a37VlIw",
  authDomain: "donation-aa466.firebaseapp.com",
  projectId: "donation-aa466",
  storageBucket: "donation-aa466.appspot.com",
  messagingSenderId: "148678360409",
  appId: "1:148678360409:web:65a5dc5e3dbf3489816048",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

export {
  firebaseConfig,
  app,
  auth,
  signInWithEmailAndPassword,
  collection,
  addDoc,
  db,
  createUserWithEmailAndPassword,
  firebase,
};
