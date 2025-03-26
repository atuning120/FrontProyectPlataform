import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../components/Auth/GoogleButton";

export default function Login() {
  const { user, error } = useContext(AuthContext); // Obtener error
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "profesor" ? "/teacher" : "/student");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        {error && (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        )}

        <GoogleButton />
      </div>
    </div>
  );
}
