import { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import ToggleButton from '../ToggleButton';  // Importamos ToggleButton
import { useFormatForm } from './useFormatForm';  // Importamos nuestro hook

import formats from './formats.json'; // Importar los formatos

export default function CreateAnsweredClinicalRecords({ clinicalRecordNumber }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario

  const {
    selectedFormat,
    responses,
    handleFormatChange,
    handleInputChange
  } = useFormatForm(formats); // Usamos el hook para manejar el formato y respuestas

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Crear el formato de respuesta en el formato esperado por el backend
      const formattedResponses = Object.entries(responses).map(([key, value]) => {
        return `${key}: "${value}"`;
      }).join("\n");

      // Enviar las respuestas al backend
      await axios.post("http://localhost:5000/api/answered-clinical-records", {
        clinicalRecordNumber,
        email: user.email,
        answer: formattedResponses,
      });

      alert("Respuesta enviada con éxito.");
    } catch (error) {
      setError("Hubo un error al enviar la respuesta.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar el formulario al hacer clic en "Ingresar"
  const handleIngresarClick = () => {
    setShowForm(true);
  };

  // Función para ocultar el formulario y regresar al estado inicial
  const handleCancelClick = () => {
    setShowForm(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {!showForm ? (
        <ToggleButton
          isVisible={false}
          onToggle={handleIngresarClick}
          showText="Ingresar"
          hideText="Ingresar"
          className="bg-blue-500 text-white"
        />
      ) : (
        <div>
          {error && <div className="text-red-500">{error}</div>}

          {/* Selección del formato */}
          <div className="mb-4">
            <label htmlFor="format" className="block mb-2">Selecciona un formato:</label>
            <select
              id="format"
              onChange={(e) => handleFormatChange(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Seleccionar formato</option>
              {formats.map((format) => (
                <option key={format.id} value={format.id}>
                  {format.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mostrar campos del formato seleccionado */}
          {selectedFormat && (
            <form onSubmit={handleSubmit}>
              {selectedFormat.fields.map((field) => (
                <div key={field.key} className="mb-4">
                  <label className="block mb-2">{field.label}</label>
                  <textarea
                    value={responses[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    required
                    rows="4"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              ))}
              <div className="flex justify-between">
                <button
                  type="submit"
                  className={`p-2 bg-blue-500 text-white rounded-md ${loading ? "opacity-50" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar Respuesta"}
                </button>

                <ToggleButton
                  isVisible={true}
                  onToggle={handleCancelClick}
                  showText="Cancelar"
                  hideText="Cancelar"
                  className="bg-red-500 text-white"
                />
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
