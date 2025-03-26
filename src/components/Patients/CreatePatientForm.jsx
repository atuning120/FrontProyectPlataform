import { useState } from "react";
import axios from "axios";
import InputField from "../InputField";
import SelectField from "../SelectField";

export default function CreatePatientForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    run: "",
    gender: "",
    age: "",
    insurance: "",
    address: "",
    mobileNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "El nombre es obligatorio.";
    if (!formData.run.trim()) newErrors.run = "RUN es obligatorio.";
    if (!["Masculino", "Femenino", "Otro"].includes(formData.gender)) newErrors.gender = "Seleccione un sexo válido.";
    if (!/^\d+$/.test(formData.age) || parseInt(formData.age) < 0 || parseInt(formData.age) > 120) {
      newErrors.age = "Edad inválida (debe ser un número entre 0 y 120).";
    }
    if (!["Fonasa", "Isapre"].includes(formData.insurance)) newErrors.insurance = "Previsión inválida (Fonasa o Isapre).";
    if (!formData.address.trim()) newErrors.address = "La dirección es obligatoria.";
    if (!/^\d{9}$/.test(formData.mobileNumber.replace(/\s/g, ""))) newErrors.mobileNumber = "Número móvil inválido (9 dígitos).";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Correo inválido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "run") {
      // Limpiar todo lo que no sea número o "K"
      let cleanedValue = value.replace(/[^0-9kK]/g, "");

      // Formateamos el RUN
      if (cleanedValue.length > 8) {
        cleanedValue = cleanedValue.slice(0, 8) + "-" + cleanedValue[8];
      }

      // Insertar puntos después de cada 3 dígitos
      if (cleanedValue.length <= 8) {
        cleanedValue = cleanedValue.replace(/(\d{1,3})(?=\d)/g, "$1.");
      }

      // Limitar la longitud a 12 caracteres
      if (cleanedValue.length > 12) {
        cleanedValue = cleanedValue.slice(0, 12);
      }

      setFormData({ ...formData, run: cleanedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Por favor, corrige los errores antes de continuar.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/patients", formData);
      alert("Paciente guardado con éxito!");
      onClose();
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
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition mt-2"
          disabled={loading}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
