import { createContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../../services/firebase";

// Creamos el contexto de autenticación
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Suscripción al estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        let role = "alumno"; // Por defecto, se asigna el rol de alumno

        // Asignar rol de profesor a usuarios específicos o con correos específicos
        if (email === "benjagilberto44@gmail.com" || email === "silasglauco@gmail.com" || email === "cristian.ignacio.nunez@gmail.com") {
          role = "profesor";
        } else if (email.endsWith("@ucn.cl") || email.endsWith("@ce.ucn.cl")) {
          role = "profesor";  // Si el correo termina en "@ucn.cl" o "@ce.ucn.cl", asignar como profesor
        } else if (!email.endsWith("@alumnos.ucn.cl")) {
          // Si el correo no es de un alumno ni de un profesor, se deniega el acceso
          setUser(null);
          setError("Acceso solo para correos de UCN");
          setLoading(false);
          return;
        }

        // Asignar el rol al usuario
        setUser({ ...user, role });
        setError(null); // Limpiar cualquier error previo
      } else {
        // Si no hay usuario logueado, limpiar el estado
        setUser(null);
        setError(null);
      }

      setLoading(false); // Finalizar la carga al procesar el estado de autenticación
    });

    return unsubscribe;
  }, []);

  // Mostrar mensaje de carga mientras se obtiene el estado de autenticación
  if (loading) return <div>Cargando...</div>;

  // Proporcionar el contexto de autenticación a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, error }}>
      {children}
    </AuthContext.Provider>
  );
}
