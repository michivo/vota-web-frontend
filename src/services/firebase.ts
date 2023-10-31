
import 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { userStore } from '../stores/userStore';

const firebaseConfig = {
  apiKey: "AIzaSyD6MJ7PQcWtramus7Mh7O7LZ5-Qav-Zy_Y",
  authDomain: "vota-web-test.firebaseapp.com",
  projectId: "vota-web-test",
  storageBucket: "vota-web-test.appspot.com",
  messagingSenderId: "162053015852",
  appId: "1:162053015852:web:cab0ebda937e06bdb84489"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);


firebaseAuth.onAuthStateChanged((user) => {
  if (userStore) {
    userStore.set({
      isLoggedIn: user !== null,
      user,
      initialized: true,
    });
  }
});

export { firebaseApp, firebaseAuth };