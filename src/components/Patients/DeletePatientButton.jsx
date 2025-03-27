import axios from "axios";

export default function DeletePatientButton({ patientId, onDelete }) {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/patients/${patientId}`);
      onDelete(patientId); // Llamamos a la función de actualización en PatientList
      alert(response.data.message); // Mostramos mensaje de éxito
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Hubo un error al eliminar el paciente.");
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
