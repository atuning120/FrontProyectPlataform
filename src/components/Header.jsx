import { useContext } from "react";
import { AuthContext } from "./Auth/AuthProvider";
import { logout } from "../services/firebase";

// Componente de encabezado que muestra la información del usuario y permite cerrar sesión
export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center fixed top-0 w-full z-10">
      {/* Imagen de perfil */}
      <img src={user.photoURL} alt="Perfil de usuario" className="w-16 h-16 rounded-full" />

      {/* Nombre y correo */}
      <p className="font-medium mt-2">{user.displayName}</p>
      <p className="text-sm text-gray-500">{user.email}</p>

      {/* Rol del usuario */}
      <p className="text-lg font-medium">Rol: {user.role === "profesor" ? "Profesor" : "Alumno"}</p>

      {/* Botón de cierre de sesión */}
      <button
        onClick={logout}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
