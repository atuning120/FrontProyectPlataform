import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../components/Auth/GoogleButton";
import logoUCN from "../assets/logoUCNblancoNegro.png";

// Página de inicio de sesión con Google
export default function Login() {
  const { user, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "profesor") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-950 to-blue-900"
      style={{ userSelect: "none" }}
    >
      {/* Imagen arriba centrada */}
      <div className="w-full flex justify-center mt-8">
        <img src={logoUCN} alt="Logo UCN" className="w-40 h-auto" />
      </div>

      {/* Contenedor centrado verticalmente en el resto del espacio */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 text-center transform transition-all duration-300 hover:shadow-3xl hover:scale-105">
          {loading ? (
            // Loader mientras Firebase resuelve el estado de autenticación
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <svg className="animate-spin h-10 w-10 text-blue-600 mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <p className="text-gray-500">Cargando...</p>
            </div>
          ) : (
            <>
              <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Bienvenido</h1>
              <p className="text-gray-600 mb-4">Inicia sesión para continuar</p>
              {/* Mensaje de error */}
              {error && (
                <div className="text-red-600 bg-red-100 p-3 rounded-md mb-4 border border-red-400 animate-pulse">
                  {error}
                </div>
              )}
              <GoogleButton className="w-full transition-all duration-300 hover:scale-110 hover:shadow-md" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
