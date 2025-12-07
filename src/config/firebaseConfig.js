// Firebase para EXPO (NO usar analytics)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_O8ivsMlMcEeoRTNZA3G_LvPT5uWvKxs",
  authDomain: "ecommerce-coder-bb123.firebaseapp.com",
  projectId: "ecommerce-coder-bb123",
  storageBucket: "ecommerce-coder-bb123.firebasestorage.app",
  messagingSenderId: "963463045934",
  appId: "1:963463045934:web:b2662af5958b6fc8edd0bf",
  measurementId: "G-FCYXX5RZK2"
};


// Inicializar app
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
