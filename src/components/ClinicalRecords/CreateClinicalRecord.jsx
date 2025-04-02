import { useState } from "react";
import axios from "axios";
import { useClinicalRecordForm } from "./useClinicalRecordForm";
import InputField from "../InputField";

export default function CreateClinicalRecord({ onClose }) {
  const initialFormData = {
    patientRunDigits: "",
    patientRunVerifier: "",
    content: "",
  };

  const {
    formData,
    setFormData,
    errors,
    validateForm,
    handleChange,
  } = useClinicalRecordForm(initialFormData);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Por favor, corrige los errores antes de continuar.");
      return;
    }

    setLoading(true);

    // Concatenar el RUN en el formato correcto
    const formattedRun = `${formData.patientRunDigits}-${formData.patientRunVerifier}`;

    try {
      await axios.post("http://localhost:5000/api/clinical-records", {
        ...formData,
        patientRun: formattedRun,
      });
      alert("Ficha creada exitosamente");
      setFormData(initialFormData); // Limpiar el formulario
      onClose(); // Cerrar el formulario después de la creación
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Error inesperado al crear la ficha.");
      } else if (error.request) {
        alert("No se pudo conectar al servidor.");
      } else {
        alert("Error al realizar la solicitud.");
      }
      console.error("Error creando ficha clínica:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Crear Ficha Clínica</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">RUN</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="patientRunDigits"
              value={formData.patientRunDigits}
              onChange={handleChange}
              className="flex-1 p-2 border rounded-lg"
              required
            />
            <span className="text-gray-500">-</span>
            <input
              type="text"
              name="patientRunVerifier"
              value={formData.patientRunVerifier}
              onChange={handleChange}
              className="w-12 p-2 border rounded-lg text-center uppercase"
              maxLength="1"
              required
            />
          </div>
          {errors.patientRunDigits && (
            <div className="text-red-600 text-sm">{errors.patientRunDigits}</div>
          )}
          {errors.patientRunVerifier && (
            <div className="text-red-600 text-sm">{errors.patientRunVerifier}</div>
          )}
        </div>
        <InputField
          label="Contenido (Motivo de consulta)"
          name="content"
          value={formData.content}
          onChange={handleChange}
          error={errors.content}
          type="text"
        />
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
