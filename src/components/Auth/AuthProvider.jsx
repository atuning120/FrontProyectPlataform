import { createContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../../services/firebase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;

        let role = "alumno"; // Por defecto, todos son alumnos

        // Definir profesores reales
        if (email.endsWith("@ucn.cl") || email.endsWith("@ce.ucn.cl")) {
          role = "profesor";
        }

        // 🔧 FORZAR MI CORREO COMO PROFESOR (Comentar esta línea para desactivar)
        if (email === "benjamin.gilberto@alumnos.ucn.cl") {
          role = "profesor";
        }

        setUser({ ...user, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
