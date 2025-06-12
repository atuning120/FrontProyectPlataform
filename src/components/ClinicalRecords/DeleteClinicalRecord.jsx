import { useState } from "react";
import axios from "axios";

export default function DeleteClinicalRecord({ recordId, onDelete, setNotification, pedirConfirmacion }) {
  const [loading, setLoading] = useState(false);

  // Solo elimina realmente si hay confirmación
  const eliminarDefinitivo = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:5000/api/clinical-records/${recordId}`);
      setNotification?.({
        message: response.data.message || "Ficha clínica eliminada exitosamente.",
        type: "success"
      });
      onDelete(recordId);
    } catch (error) {
      console.error("Error eliminando la ficha clínica:", error);
      setNotification?.({
        message: error.response?.data?.message || "Hubo un error al eliminar la ficha clínica.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (loading) return;
    pedirConfirmacion?.(
      "¿Estás seguro de que deseas eliminar esta ficha clínica?",
      eliminarDefinitivo
    );
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
