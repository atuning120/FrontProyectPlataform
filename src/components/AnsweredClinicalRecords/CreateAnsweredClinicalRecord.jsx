import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Auth/AuthProvider';
import { useFormatForm } from './useFormatForm';
import formats from '../../data/formats.json';

export default function CreateAnsweredClinicalRecords({ clinicalRecordNumber, onSubmit }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);

  const {
    selectedFormat,
    responses,
    handleFormatChange,
    handleInputChange
  } = useFormatForm(formats);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formattedResponses = Object.entries(responses).map(([key, value]) => {
        return `${key}: "${value}"`;
      }).join("\n");

      await axios.post("http://localhost:5000/api/answered-clinical-records", {
        clinicalRecordNumber,
        email: user.email,
        answer: formattedResponses,
      });

      alert("Respuesta enviada con éxito.");
      setShowForm(false);
      if (onSubmit) onSubmit();
    } catch (error) {
      setError("Hubo un error al enviar la respuesta.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setShowForm(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {showForm && (
        <div>
          {error && <div className="text-red-500">{error}</div>}

          {/* Selector de formato */}
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

          {/* Mostrar formulario por secciones */}
          {selectedFormat && selectedFormat.sections && (
            <form onSubmit={handleSubmit}>
              {selectedFormat.sections.map((section, idx) => (
                <div key={idx} className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">{section.section}</h2>
                  {section.fields.map((field) => (
                    <div key={field.key} className="mb-4">
                      <label className="block mb-1 font-medium">{field.label}</label>
                      <textarea
                        value={responses[field.key] || ""}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        required
                        rows="3"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  ))}
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className={`p-2 bg-blue-500 text-white rounded-md ${loading ? "opacity-50" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar Respuesta"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="p-2 bg-red-500 text-white rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
