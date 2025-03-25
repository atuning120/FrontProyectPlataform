import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";

export default function StudentPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirigir si el usuario no es alumno
  useEffect(() => {
    if (!user || user.role !== "alumno") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "alumno") return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <UserProfile />
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h1 className="text-2xl font-bold">Página del Alumno</h1>
          <p className="mt-4 text-gray-600">Aquí los alumnos podrán ver y responder fichas técnicas.</p>
        </div>
      </div>
    </div>
  );
}
