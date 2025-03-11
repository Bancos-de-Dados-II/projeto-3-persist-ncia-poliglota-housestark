import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDPdQz1JNFX8eeX4CxUqb53E73ETP0bpUc",
  authDomain: "agricultura-banco3.firebaseapp.com",
  projectId: "agricultura-banco3",
  storageBucket: "agricultura-banco3.firebasestorage.app",
  messagingSenderId: "440305396693",
  appId: "1:440305396693:web:0cc1dfd7944b362270eb5c",
  measurementId: "G-D92N9S3QK4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);