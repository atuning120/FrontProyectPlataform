import { useState } from "react";
import axios from "axios";

export default function DeleteClinicalRecord({ recordId, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);  // Deshabilitar el botón al inicio

    try {
      // Intentar eliminar la ficha clínica
      await axios.delete(`http://localhost:5000/api/clinical-records/${recordId}`);
      onDelete(recordId); // Llamada para actualizar el estado tras la eliminación
      alert("Ficha clínica eliminada con éxito!");
    } catch (error) {
      console.error("Error eliminando la ficha clínica:", error);

      // Mostrar el mensaje de error específico si existe
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Hubo un error al eliminar la ficha clínica.");
      }
    } finally {
      setLoading(false);  // Habilitar el botón nuevamente cuando se complete la solicitud
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      disabled={loading}  // Deshabilitar el botón mientras carga
    >
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
