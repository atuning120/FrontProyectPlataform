import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  onAuthStateChanged 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1ZxNjQIW_QhgzuSXRdhdrleLq8y6AOY8",
  authDomain: "proy-intr.firebaseapp.com",
  projectId: "proy-intr",
  storageBucket: "proy-intr.appspot.com",
  messagingSenderId: "776192749489",
  appId: "1:776192749489:web:ac081ee6cecd93cd529790"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Función para login con Google
const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

// Función para logout
const logout = () => {
  signOut(auth);
};

// Exporta todo lo necesario
export { 
  auth,
  googleProvider,
  signInWithGoogle,
  logout,
  onAuthStateChanged
};