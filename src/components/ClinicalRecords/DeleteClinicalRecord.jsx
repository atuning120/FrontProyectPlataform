import { useState } from "react";
import axios from "axios";

export default function DeleteClinicalRecord({ recordId, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta ficha clínica?")) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/clinical-records/${recordId}`);
      onDelete(recordId);
      alert("Ficha clínica eliminada con éxito!");
    } catch (error) {
      console.error("Error eliminando la ficha clínica:", error);
      alert(error.response?.data?.message || "Hubo un error al eliminar la ficha clínica.");
    } finally {
      setLoading(false);
    }
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
