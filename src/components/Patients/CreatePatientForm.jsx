import { useState } from "react";

export default function CreatePatientForm({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    run: "",
    fichaClinica: "",
    sexo: "",
    fechaNacimiento: "",
    edad: "",
    prevision: "",
    poblacion: "",
    direccion: "",
    numero: "",
    correo: "",
    departamento: "",
    sector: "",
    comuna: "",
    numeroMovil: "",
    estadoCivil: "",
    ocupacion: "",
    puebloIndigena: "",
    nacionalidad: "",
    establecimientoNotifica: "",
    escolaridad: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Paciente creado:", formData);
    onClose(); // Cerrar el formulario después de enviar
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Administración - Crear Paciente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{key}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-lg"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Guardar Paciente
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition mt-2"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
