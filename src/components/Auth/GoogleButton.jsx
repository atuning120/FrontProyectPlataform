import { useState } from "react";
import { signInWithGoogle } from "../../services/firebase";
import { FcGoogle } from "react-icons/fc";

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
      disabled={loading}
      aria-label="Iniciar sesión con Google"
    >
      <FcGoogle className="text-lg" />
      {loading ? "Cargando..." : "Continuar con Google"}
    </button>
  );
}
