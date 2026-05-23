// Importaciones Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Configuración
const firebaseConfig = {
apiKey: "AIzaSyBtXPd1KDSgj0OWCebrbWWYEacnBTDrAa4",
  authDomain: "sinapdw-3b58e.firebaseapp.com",
  projectId: "sinapdw-3b58e",
  storageBucket: "sinapdw-3b58e.firebasestorage.app",
  messagingSenderId: "1082635211916",
  appId: "1:1082635211916:web:e362cabbd44e6d967597a9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Base de datos
const db = getFirestore(app);

// Autenticación
const auth = getAuth(app);

// Exportar
export { db, auth };