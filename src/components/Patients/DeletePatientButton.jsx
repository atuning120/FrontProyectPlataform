import axios from "axios";

// Botón para eliminar un paciente
export default function DeletePatientButton({ patientId, onDelete }) {
  const handleDelete = async () => {
    try {
      // Intentar eliminar el paciente
      const response = await axios.delete(`http://localhost:5000/api/patients/${patientId}`);
      onDelete(patientId); // Llamada para actualizar la lista de pacientes tras la eliminación
      alert(response.data.message);
    } catch (error) {
      console.error("Error eliminando el paciente:", error);

      // Mostrar el mensaje de error
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Hubo un error al eliminar el paciente.");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
    >
      Eliminar
    </button>
  );
}
