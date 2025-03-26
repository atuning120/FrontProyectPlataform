import { useState } from "react";
import axios from "axios";

export default function CreatePatientForm({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    run: "",
    medicalRecord: "",
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
    if (!/^\d{7,8}-[0-9kK]$/.test(formData.run)) newErrors.run = "RUN inválido (Ej: 12345678-9).";
    if (!formData.medicalRecord.trim()) newErrors.medicalRecord = "Debe ingresar la ficha clínica.";
    if (!["Masculino", "Femenino", "Otro"].includes(formData.gender)) newErrors.gender = "Seleccione un sexo válido.";

    if (!/^\d+$/.test(formData.age) || parseInt(formData.age) < 0 || parseInt(formData.age) > 120) {
      newErrors.age = "Edad inválida (debe ser un número entre 0 y 120).";
    }

    if (!["Fonasa", "Isapre"].includes(formData.insurance)) newErrors.insurance = "Previsión inválida (Fonasa o Isapre).";

    if (!formData.address.trim()) newErrors.address = "La dirección es obligatoria.";
    if (!/^\d{9}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Número móvil inválido (9 dígitos).";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Correo inválido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: null }));
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
        {/* Mapeamos las claves y las reemplazamos con los nombres en español */}
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {/* Reemplazamos el nombre de la clave por su traducción en español */}
              {key === "fullName" && "Nombre completo"}
              {key === "run" && "RUN"}
              {key === "medicalRecord" && "Ficha clínica"}
              {key === "gender" && "Sexo"}
              {key === "age" && "Edad"}
              {key === "insurance" && "Previsión"}
              {key === "address" && "Dirección"}
              {key === "mobileNumber" && "Número móvil"}
              {key === "email" && "Correo"}
            </label>

            {key === "gender" ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-lg ${errors.gender ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            ) : key === "insurance" ? (
              <select
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-lg ${errors.insurance ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Seleccione...</option>
                <option value="Fonasa">Fonasa</option>
                <option value="Isapre">Isapre</option>
              </select>
            ) : (
              <input
                type={key === "age" ? "text" : "text"} // Evita input number con flechitas
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className={`mt-1 p-2 w-full border rounded-lg ${errors[key] ? "border-red-500" : "border-gray-300"}`}
              />
            )}

            {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
          </div>
        ))}

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
