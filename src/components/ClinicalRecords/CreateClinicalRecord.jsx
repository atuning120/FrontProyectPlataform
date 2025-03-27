import { useState } from "react";
import axios from "axios";

export default function CreateClinicalRecord({ onClose }) {
  const [patientRun, setPatientRun] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mostrar errores

  const formatRun = (value) => {
    let cleanedValue = value.replace(/[^0-9kK]/g, "");
    if (cleanedValue.length > 8) {
      cleanedValue = cleanedValue.slice(0, 8) + "-" + cleanedValue[8];
    }
    if (cleanedValue.length <= 8) {
      cleanedValue = cleanedValue.replace(/(\d{1,3})(?=\d)/g, "$1.");
    }
    if (cleanedValue.length > 12) {
      cleanedValue = cleanedValue.slice(0, 12);
    }
    return cleanedValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Limpiar mensaje de error antes de hacer la solicitud

    try {
      const response = await axios.post("http://localhost:5000/api/clinical-records", {
        patientRun,
        content,
      });
      alert("Ficha creada exitosamente");
      setPatientRun("");
      setContent("");
      onClose();
    } catch (error) {
      // Manejo mejorado de errores
      if (error.response) {
        // Si el servidor responde con un error
        if (error.response.status === 404) {
          // Si el error es 404, paciente no encontrado
          setErrorMessage("El paciente con el RUN proporcionado no existe.");
        } else {
          setErrorMessage(error.response.data.message || "Error inesperado al crear la ficha.");
        }
      } else if (error.request) {
        // Si no se recibe respuesta del servidor
        setErrorMessage("No se pudo conectar al servidor.");
      } else {
        // Errores inesperados
        setErrorMessage("Error al realizar la solicitud.");
      }
      console.error("Error creating clinical record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "patientRun") {
      setPatientRun(formatRun(value));
    } else {
      setContent(value);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Crear Ficha Clínica</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">RUN del Paciente</label>
          <input
            type="text"
            name="patientRun"
            value={patientRun}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contenido</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Ficha"}
        </button>
      </form>
    </div>
  );
}
