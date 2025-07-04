
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCFbwBVDAqXHkhyJkUY8-o7lrsQvGaP1jA",
  authDomain: "flockwishlist.firebaseapp.com",
  projectId: "flockwishlist",
  storageBucket: "flockwishlist.firebasestorage.app",
  messagingSenderId: "907577274434",
  appId: "1:907577274434:web:c0ad820014aeefa4817ddb",
  measurementId: "G-82GPX2S95L"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);