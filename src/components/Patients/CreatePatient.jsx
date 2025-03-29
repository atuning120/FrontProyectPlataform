import { useState } from "react";
import axios from "axios";
import { usePatientForm } from "./usePatientForm";
import InputField from "../InputField";
import SelectField from "../SelectField";

// Formulario para crear un paciente
export default function CreatePatientForm({ onClose }) {
  const initialFormData = {
    fullName: "",
    runDigits: "",
    runVerifier: "",
    gender: "",
    age: "",
    insurance: "",
    address: "",
    mobileNumber: "",
    email: "",
  };

  const { formData, errors, validateForm, handleChange } = usePatientForm(initialFormData);
  const [loading, setLoading] = useState(false);

  // Enviar el formulario al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      alert("Por favor, corrige los errores antes de continuar.");
      return;
    }

    setLoading(true);

    try {
      // Combinar RUN y dígito verificador para enviar al servidor
      const fullRun = `${formData.runDigits}-${formData.runVerifier}`; // Mantener puntos y concatenar con guion

      await axios.post("https://backproyectplataform.onrender.com/api/patients", {
        ...formData,
        run: fullRun, // Enviar el RUN completo con el dígito verificador
      });
      alert("Paciente guardado con éxito!");
      onClose(); // Cerrar el formulario al guardar
    } catch (error) {
      console.error("Error al guardar el paciente:", error);
      alert("Hubo un error al guardar el paciente.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Administración - Crear Paciente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Nombre completo"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />
        <div>
          <label className="block text-gray-700">RUN</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="runDigits"
              value={formData.runDigits}
              onChange={handleChange} // Delegar a usePatientForm
              className="flex-1 p-2 border rounded-lg"
              placeholder="12.345.678"
              required
            />
            <span className="text-gray-500">-</span>
            <input
              type="text"
              name="runVerifier"
              value={formData.runVerifier}
              onChange={handleChange} // Delegar a usePatientForm
              className="w-12 p-2 border rounded-lg text-center uppercase"
              placeholder="K"
              maxLength="1"
              required
            />
          </div>
          {errors.runDigits && (
            <div className="text-red-600 text-sm">{errors.runDigits}</div>
          )}
          {errors.runVerifier && (
            <div className="text-red-600 text-sm">{errors.runVerifier}</div>
          )}
        </div>
        <SelectField
          label="Sexo"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={["Masculino", "Femenino", "Otro"]}
          error={errors.gender}
        />
        <InputField
          label="Edad"
          name="age"
          value={formData.age}
          onChange={handleChange}
          error={errors.age}
          type="text"
        />
        <SelectField
          label="Previsión"
          name="insurance"
          value={formData.insurance}
          onChange={handleChange}
          options={["Fonasa", "Isapre", "Particular"]}
          error={errors.insurance}
        />
        <InputField
          label="Dirección"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
        />
        <InputField
          label="Teléfono móvil"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          error={errors.mobileNumber}
        />
        <InputField
          label="Correo electrónico"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          type="email"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Paciente"}
        </button>
      </form>
    </div>
  );
}