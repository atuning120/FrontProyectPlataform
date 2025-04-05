import { useState } from "react";
import axios from "axios";
import { usePatientForm } from "./usePatientForm";
import InputField from "../InputField";
import SelectField from "../SelectField";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isValid = validateForm();
    if (!isValid) {
      alert("Por favor, corrige los errores antes de continuar.");
      return;
    }
  
    setLoading(true);
  
    try {
      const patientData = {
        ...formData,
        run: `${formData.runDigits}-${formData.runVerifier}`,
      };
  
      if (!patientData.email) {
        delete patientData.email;
      }
  
      await axios.post("http://localhost:5000/api/patients", patientData);
      alert("Paciente guardado con éxito!");
      onClose();
    } catch (error) {
      console.error("Error al guardar el paciente:", error);
  
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error de conexión con el servidor. Intente nuevamente.");
      }
    }
  
    setLoading(false);
  };  

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Crear Paciente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Nombre completo" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
        
        <div>
          <label className="block text-gray-700">RUN</label>
          <div className="flex items-center gap-2">
            <input type="text" name="runDigits" value={formData.runDigits} onChange={handleChange} className="flex-1 p-2 border rounded-lg" required />
            <span className="text-gray-500">-</span>
            <input type="text" name="runVerifier" value={formData.runVerifier} onChange={handleChange} className="w-12 p-2 border rounded-lg text-center uppercase" maxLength="1" required />
          </div>
          {errors.runDigits && <div className="text-red-600 text-sm">{errors.runDigits}</div>}
          {errors.runVerifier && <div className="text-red-600 text-sm">{errors.runVerifier}</div>}
        </div>
        
        <SelectField label="Sexo" name="gender" value={formData.gender} onChange={handleChange} options={["Masculino", "Femenino", "Otro"]} error={errors.gender} />
        <InputField label="Edad" name="age" value={formData.age} onChange={handleChange} error={errors.age} type="text" />
        <SelectField label="Previsión" name="insurance" value={formData.insurance} onChange={handleChange} options={["Fonasa", "Isapre", "Particular"]} error={errors.insurance} />
        <InputField label="Dirección" name="address" value={formData.address} onChange={handleChange} error={errors.address} />
        <InputField label="Teléfono móvil" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} error={errors.mobileNumber} />
        <InputField label="Correo electrónico" name="email" value={formData.email} onChange={handleChange} error={errors.email} type="email" />
        
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Paciente"}
        </button>
      </form>
    </div>
  );
}
