import axios from "axios";
import { useState } from "react";

export default function DeletePatientButton({ patientId, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/patients/${patientId}`
      );
      onDelete(patientId);
      alert(response.data.message);
    } catch (error) {
      console.error("Error eliminando el paciente:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Hubo un error al eliminar el paciente.");
      }
    } finally {
      setLoading(false);
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
      {loading ? "Eliminando..." : "Eliminar"} {/* Cambiar texto durante la carga */}
    </button>
  );
}