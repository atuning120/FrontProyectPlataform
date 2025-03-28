import { useState } from "react";
import axios from "axios";
import { usePatientForm } from "./usePatientForm";
import InputField from "../InputField";
import SelectField from "../SelectField";

// Formulario para crear un paciente
export default function CreatePatientForm({ onClose }) {
  const initialFormData = {
    fullName: "",
    run: "",
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
    if (!validateForm()) {
      alert("Por favor, corrige los errores antes de continuar.");
      return;
    }
    
    setLoading(true);

    try {
      await axios.post("https://backproyectplataform.onrender.com/api/patients", formData);
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
        <InputField
          label="RUN"
          name="run"
          value={formData.run}
          onChange={handleChange}
          error={errors.run}
        />
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
          options={["Fonasa", "Isapre"]}
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
          label="Número móvil"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          error={errors.mobileNumber}
        />
        <InputField
          label="Correo"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Paciente"}
        </button>
      </form>
    </div>
  );
}
