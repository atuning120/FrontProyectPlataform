import axios from "axios";
import { useState } from "react";

export default function DeletePatient({ patientId, onDelete, setNotification, pedirConfirmacion }) {
  const [loading, setLoading] = useState(false);

  const eliminarDefinitivo = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API}/patients/${patientId}`);
      onDelete(patientId);
      setNotification?.({ message: response.data.message, type: "success" });
    } catch (error) {
      console.error("Error eliminando el paciente:", error);
      const errorMessage = error.response?.data?.message || "Hubo un error al eliminar el paciente.";
      setNotification?.({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (loading) return;
    // Usar el diálogo de confirmación si está disponible
    if (pedirConfirmacion) {
      pedirConfirmacion("¿Estás seguro de que deseas eliminar este paciente?", eliminarDefinitivo);
    } else {
      // Fallback al confirm del navegador si no se pasa la prop
      if (window.confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
        eliminarDefinitivo();
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  );
}