import { useContext } from "react";
import { AuthContext } from "./Auth/AuthProvider";
import { logout } from "../services/firebase";

export default function UserProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
      <img src={user.photoURL} alt="User profile" className="w-16 h-16 rounded-full" />
      <p className="font-medium mt-2">{user.displayName}</p>
      <p className="text-sm text-gray-500">{user.email}</p>
      <p className="text-lg font-medium">Rol: {user.role === "profesor" ? "Profesor" : "Alumno"}</p>
      <button
        onClick={logout}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
