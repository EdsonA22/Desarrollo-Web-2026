// Importaciones Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAnalytics,
  isSupported,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Configuracion
const firebaseConfig = {
  apiKey: "AIzaSyBtXPd1KDSgj0OWCebrbWWYEacnBTDrAa4",
  authDomain: "sinapdw-3b58e.firebaseapp.com",
  projectId: "sinapdw-3b58e",
  storageBucket: "sinapdw-3b58e.firebasestorage.app",
  messagingSenderId: "1082635211916",
  appId: "1:1082635211916:web:e362cabbd44e6d967597a9",
  measurementId: "G-59RZT8CS07",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;

isSupported()
  .then((supported) => {
    if (supported) analytics = getAnalytics(app);
  })
  .catch((error) => {
    console.warn("Firebase Analytics no esta disponible:", error);
  });

// Base de datos
const db = getFirestore(app);

// Autenticacion
const auth = getAuth(app);

// Exportar
export { app, db, auth, analytics };
