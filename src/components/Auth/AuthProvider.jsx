import { createContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../../services/firebase";
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Esta función se ejecutará cuando el estado de autenticación de Firebase cambie
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        //  Si el usuario inicia sesión en Firebase, obtenemos su ID Token.
        const idToken = await firebaseUser.getIdToken();
 
        try {
          // Enviamos el ID Token a nuestro backend.
          const response = await fetch(`${import.meta.env.VITE_API}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });

          if (!response.ok) {
            // el backend rechaza el token, lanzamos un error.
            const errorText = await response.text();
            throw new Error(errorText || "Acceso solo para correos institucionales de alumnos UCN.");
          }

          // El backend nos devuelve nuestro propio token (JWT).
          const { token } = await response.json();

          // Guardamos nuestro token en el localStorage para persistir la sesión.
          localStorage.setItem("appToken", token);

          // Decodificamos el token para obtener los datos del usuario (incluido el rol).
          const decodedUser = jwtDecode(token);

          // Actualizamos el estado del usuario en la aplicación.
          setUser(decodedUser);
          setError(null);
        } catch (err) {
          console.error("Error de autenticación con el backend:", err);
          setError(err.message);
          setUser(null);
          localStorage.removeItem("appToken"); // Limpiamos en caso de error
        }
      } else {
        //  Si el usuario cierra sesión en Firebase, limpiamos todo.
        setUser(null);
        localStorage.removeItem("appToken");
      }
      setLoading(false);
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  // El resto del componente sigue igual
  return (
    <AuthContext.Provider value={{ user, loading, error, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}