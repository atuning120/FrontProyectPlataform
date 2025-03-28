import { signInWithGoogle } from "../../services/firebase";
import { FcGoogle } from "react-icons/fc";

// Componente de botón para iniciar sesión con Google
export default function GoogleButton() {
  return (
    <button
      onClick={signInWithGoogle}
      className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      <FcGoogle className="text-lg" />
      Continuar con Google
    </button>
  );
}
