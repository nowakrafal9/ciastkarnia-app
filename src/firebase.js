import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD_yLN1jhENwYcGrxOfYGlmr6qC8QFXEh4",
    authDomain: "ciastkarnia-app.firebaseapp.com",
    projectId: "ciastkarnia-app",
    storageBucket: "ciastkarnia-app.appspot.com",
    messagingSenderId: "455317369895",
    appId: "1:455317369895:web:1b3a4e4f999fce18fcca02"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
