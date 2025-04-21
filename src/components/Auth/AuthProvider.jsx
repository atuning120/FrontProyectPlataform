import { createContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../../services/firebase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email } = user;
        let role = "alumno"; // Rol por defecto

        // ✅ ADMIN
        if (email === "vergamacarena@gmail.com") {
          role = "admin";
        }

        // ✅ PROFESOR
        else if (
          [
            "benjagilberto44@gmail.com",
            "silasglauco@gmail.com",
            "cristian.ignacio.nunez@gmail.com"
          ].includes(email) ||
          email.endsWith("@ucn.cl") ||
          email.endsWith("@ce.ucn.cl")
        ) {
          role = "profesor";
        }

        // ❌ NO PERMITIDO
        else if (!email.endsWith("@alumnos.ucn.cl")) {
          setUser(null);
          setError("Acceso solo para correos institucionales de la UCN");
          setLoading(false);
          return;
        }

        // ✅ Usuario permitido
        setUser({ ...user, role });
        setError(null);
      } else {
        // Usuario deslogueado
        setUser(null);
        setError(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
