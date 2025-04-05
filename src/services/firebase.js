import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// Configuración de Firebase (NO exponer apiKey en producción)
const firebaseConfig = {
  apiKey: "AIzaSyB1ZxNjQIW_QhgzuSXRdhdrleLq8y6AOY8",
  authDomain: "proy-intr.firebaseapp.com",
  projectId: "proy-intr",
  storageBucket: "proy-intr.appspot.com",
  messagingSenderId: "776192749489",
  appId: "1:776192749489:web:ac081ee6cecd93cd529790"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Inicia sesión con Google usando una ventana emergente.
 * @returns {Promise<void>}
 */
const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error.message);
    alert("No se pudo iniciar sesión con Google. Inténtalo de nuevo.");
  }
};

/**
 * Cierra la sesión del usuario actual.
 */
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
    alert("Error al cerrar sesión. Inténtalo de nuevo.");
  }
};

// Exportación de las funciones y objetos necesarios
export { 
  auth,
  googleProvider,
  signInWithGoogle,
  logout,
  onAuthStateChanged
};
