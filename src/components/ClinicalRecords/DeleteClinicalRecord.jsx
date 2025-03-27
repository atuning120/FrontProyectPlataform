import axios from "axios";

export default function DeleteClinicalRecord({ recordId, onDelete }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/clinical-records/${recordId}`);
      onDelete(recordId);
    } catch (error) {
      console.error("Error eliminando la ficha clínica:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
    >
      Eliminar
    </button>
  );
}
