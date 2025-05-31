import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import { useFormatForm } from "./useFormatForm";
import formatsData from "../../data/formats.json"; // Renombrado para evitar conflicto

export default function CreateAnsweredClinicalRecords({ clinicalRecordNumber, patientRun, onSubmit, onPatientLoaded }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const [baseFields, setBaseFields] = useState({
    anamnesis: "",
    exploracion: "",
    diagnostico: "",
  });

  const {
    selectedFormats,
    responses,
    handleFormatSelectionChange,
    handleInputChange,
  } = useFormatForm(formatsData);

  useEffect(() => {
    setStartTime(Date.now());

    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/${patientRun}`);
        setPatientData(response.data);
        onPatientLoaded?.(response.data.fullName);
      } catch (err) {
        setError("Error obteniendo los datos del paciente.");
        console.error("Error obteniendo datos del paciente:", err);
      }
    };

    if (patientRun) {
      fetchPatientData();
    }
  }, [patientRun, onPatientLoaded, clinicalRecordNumber]);

  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const allBaseFieldsFilled = Object.values(baseFields).every((v) => v.trim() !== "");

  const validateAnswers = () => {
    if (!allBaseFieldsFilled) return false;
    if (selectedFormats.length === 0) {
      // setError("Debes seleccionar al menos un formato de ficha clínica."); // Opcional: error específico
      return false;
    }

    for (const format of selectedFormats) {
      const formatResponses = responses[format.id] || {};
      for (const section of format.sections || []) {
        for (const field of section.fields || []) {
          const value = formatResponses[field.key];
          if (field.type === "checkbox_group") {
            if (value === null || value === undefined || String(value).trim() === "") return false;
          } else if (field.type === "evaluation_scale") {
            if (value === null || value === undefined) return false; // El valor 0 es válido
          } else {
            if (!value || String(value).trim() === "") return false;
          }
        }
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateAnswers()) {
      setError("Por favor, completa todos los campos base y todos los campos de los formatos seleccionados antes de enviar.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const responseTime = formatDuration(durationMs);

      const fullAnswer = {
        baseFields: { ...baseFields },
        formatSpecificAnswers: { ...responses },
      };

      const selectedFormatIds = selectedFormats.map(f => f.id);

      await axios.post("http://localhost:5000/api/answered-clinical-records", {
        clinicalRecordNumber,
        email: user.email,
        answer: fullAnswer,
        formatIds: selectedFormatIds,
        responseTime,
      });

      alert("Respuesta enviada con éxito.");
      onSubmit?.();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Hubo un error al enviar la respuesta.";
      setError(errorMessage);
      // alert(errorMessage); // El error ya se muestra en el div
      console.error("Error al enviar la respuesta:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}

      {patientData && (
        <div className="mb-4 p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold mb-2">Datos del Paciente</h3>
          <p>
            <strong>Nombre:</strong> {patientData.fullName}{" "}
            <strong>Género:</strong> {patientData.gender}{" "}
            <strong>Edad:</strong> {patientData.age}{" "}
            <strong>Seguro:</strong> {patientData.insurance}{" "}
            <strong>Dirección:</strong> {patientData.address}{" "}
            <strong>Teléfono:</strong> {patientData.mobileNumber}{" "}
            <strong>Email:</strong> {patientData.email}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4 space-y-4 p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold mb-2">Campos Base</h3>
          {[{ key: "anamnesis", label: "Anamnesis" },
            { key: "exploracion", label: "Exploración" },
            { key: "diagnostico", label: "Diagnóstico" }].map(({ key, label }) => (
            <div key={key}>
              <label htmlFor={key} className="block mb-1 font-medium">{label}</label>
              <textarea
                id={key}
                value={baseFields[key]}
                onChange={(e) => setBaseFields({ ...baseFields, [key]: e.target.value })}
                required
                rows="3"
                className="w-full p-2 border rounded-md"
              />
            </div>
          ))}
        </div>

        {allBaseFieldsFilled && (
          <div className="mb-4 p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Seleccionar Formatos de Ficha Clínica</h3>
            {formatsData.map((format) => (
              <div key={format.id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`format-checkbox-${format.id}`}
                  checked={selectedFormats.some(sf => sf.id === format.id)}
                  onChange={(e) => handleFormatSelectionChange(format.id, e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`format-checkbox-${format.id}`}>{format.name}</label>
              </div>
            ))}
          </div>
        )}

        {selectedFormats.length > 0 && (
          <>
            {selectedFormats.map((format) => {
              const formatResponses = responses[format.id] || {};
              return (
                <div key={format.id} className="mb-8 p-4 border rounded-md shadow-sm bg-white">
                  <h2 className="text-xl font-bold mb-4 text-blue-700">{format.name}</h2>
                  {(format.sections || []).map((section, sectionIdx) => (
                    <div key={`${format.id}-section-${sectionIdx}`} className="mb-6">
                      {section.section && (
                        <h3 className="text-lg font-semibold mb-2">{section.section}</h3>
                      )}

                      {(section.fields || []).map((field) => {
                        const { key, label, type, options = [], min = 0, max = 10, minLabel = "Min", maxLabel = "Max" } = field;
                        const fieldId = `field-${format.id}-${key}`;
                        return (
                          <div key={fieldId} className="mb-4">
                            <label htmlFor={fieldId} className="block mb-1 font-medium">{label}</label>
                            {type === "checkbox_group" ? (
                              <div className="space-y-1">
                                {options.map((option, optIdx) => (
                                  <label key={`${fieldId}-option-${optIdx}`} className="flex items-center">
                                    <input
                                      type="radio"
                                      id={`${fieldId}-option-${optIdx}`}
                                      name={`${format.id}-${key}`} // Asegura grupo de radio único por campo de formato
                                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                      checked={formatResponses[key] === option}
                                      onChange={() => handleInputChange(format.id, key, option)}
                                    />
                                    {option}
                                  </label>
                                ))}
                              </div>
                            ) : type === "evaluation_scale" ? (
                              <div>
                                <input
                                  type="range"
                                  id={fieldId}
                                  min={min}
                                  max={max}
                                  value={formatResponses[key] ?? min}
                                  onChange={(e) => handleInputChange(format.id, key, Number(e.target.value))}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                  <span>{minLabel} ({min})</span>
                                  <span>{maxLabel} ({max})</span>
                                </div>
                                <div className="mt-1 text-center">
                                  Valor: <strong>{formatResponses[key] ?? min}</strong>
                                </div>
                              </div>
                            ) : (
                              <textarea
                                id={fieldId}
                                value={formatResponses[key] || ""}
                                onChange={(e) => handleInputChange(format.id, key, e.target.value)}
                                required
                                rows="3"
                                className="w-full p-2 border rounded-md"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        )}
        
        {allBaseFieldsFilled && selectedFormats.length > 0 && (
          <button
            type="submit"
            className={`w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${loading || !validateAnswers() ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading || !validateAnswers()}
          >
            {loading ? "Enviando..." : "Enviar Respuesta"}
          </button>
        )}
      </form>
    </div>
  );
}