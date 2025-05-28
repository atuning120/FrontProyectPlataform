import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import { useFormatForm } from "./useFormatForm";
import formats from "../../data/formats.json";

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

  const { selectedFormat, responses, handleFormatChange, handleInputChange } = useFormatForm(formats);

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

    if (selectedFormat?.sections?.length) {
      for (const section of selectedFormat.sections) {
        for (const field of section.fields || []) {
          const value = responses[field.key];
          if (field.type === "checkbox_group") {
            if (!value || value.length === 0) return false;
          } else if (field.type === "evaluation_scale") {
            if (value === null || value === undefined) return false;
          } else {
            if (!value || value.trim() === "") return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!validateAnswers()) {
      setError("Por favor, completa todos los campos antes de enviar.");
      setLoading(false);
      return;
    }

    try {
      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const responseTime = formatDuration(durationMs);

      const fullAnswer = {
        ...baseFields,
        ...responses,
      };

      await axios.post("http://localhost:5000/api/answered-clinical-records", {
        clinicalRecordNumber,
        email: user.email,
        answer: fullAnswer,
        formatId: selectedFormat?.id,
        responseTime,
      });

      alert("Respuesta enviada con éxito.");
      onSubmit?.();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Hubo un error al enviar la respuesta.";
      setError(errorMessage);
      alert(errorMessage);
      console.error("Error al enviar la respuesta:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {error && <div className="text-red-500 mb-2">{error}</div>}

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

      <div className="mb-4 space-y-4">
        {[{ key: "anamnesis", label: "Anamnesis" },
          { key: "exploracion", label: "Exploración" },
          { key: "diagnostico", label: "Diagnóstico" }].map(({ key, label }) => (
          <div key={key}>
            <label className="block mb-1 font-medium">{label}</label>
            <textarea
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
        <div className="mb-4">
          <select
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
      )}

      {selectedFormat?.sections?.length > 0 && (
        <form onSubmit={handleSubmit}>
          {selectedFormat.sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              {section.section && (
                <h3 className="text-lg font-semibold mb-2">{section.section}</h3>
              )}

              {section.fields?.map((field) => {
                const { key, label, type, options = [], min, max, minLabel, maxLabel } = field;

                return (
                  <div key={key} className="mb-4">
                    <label className="block mb-1 font-medium">{label}</label>

                    {type === "checkbox_group" ? (
                      <div className="space-y-1">
                        {options.map((option) => (
                          <label key={option} className="block">
                            <input
                              type="radio"
                              name={key}
                              className="mr-2"
                              checked={responses[key] === option}
                              onChange={() => handleInputChange(key, option)}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    ) : type === "evaluation_scale" ? (
                      <div>
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={responses[key] ?? min}
                          onChange={(e) => handleInputChange(key, Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{minLabel}</span>
                          <span>{maxLabel}</span>
                        </div>
                        <div className="mt-1">
                          Valor: <strong>{responses[key] ?? min}</strong>
                        </div>
                      </div>
                    ) : (
                      <textarea
                        value={responses[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
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

          <button
            type="submit"
            className={`p-2 bg-blue-500 text-white rounded-md ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Respuesta"}
          </button>
        </form>
      )}
    </div>
  );
}
