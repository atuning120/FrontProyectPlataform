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
        const email = user.email;
        let role = "alumno"; 

        if (email === "benjagilberto44@gmail.com" || email == "silasglauco@gmail.com") {
          role = "profesor"; // Asignar rol profesor a este correo
        } else if (email.endsWith("@ucn.cl") || email.endsWith("@ce.ucn.cl")) {
          role = "profesor";  // Correo de profesor
        } else if (!email.endsWith("@alumnos.ucn.cl")) {
          // Si el correo no es de un alumno ni de un profesor, no dejamos logear
          setUser(null);
          setError("Acceso solo para correos de UCN");
          setLoading(false); // Aseguramos que se termine la carga
          return;
        }

        // Asignamos el rol
        setUser({ ...user, role });
        setError(null); // Limpiar cualquier error previo
      } else {
        setUser(null);
        setError(null); // Limpiar cualquier error
      }

      setLoading(false); // Terminar el loading una vez procesado
    });

    return unsubscribe;
  }, []);

  if (loading) return <div>Cargando...</div>;  // Mensaje en español

  return (
    <AuthContext.Provider value={{ user, error }}>
      {children}
    </AuthContext.Provider>
  );
}
