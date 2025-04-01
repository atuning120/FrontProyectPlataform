import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../components/Auth/GoogleButton";

export default function Login() {
  const { user, error } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === "profesor" ? "/teacher" : "/student");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 text-center transform transition-all duration-300 hover:shadow-3xl hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Bienvenido</h1>
        <p className="text-gray-600 mb-4">Inicia sesión para continuar</p>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-md mb-4 border border-red-400 animate-pulse">
            {error}
          </div>
        )}

        <GoogleButton className="w-full transition-all duration-300 hover:scale-110 hover:shadow-md" />
      </div>
    </div>
  );
}
