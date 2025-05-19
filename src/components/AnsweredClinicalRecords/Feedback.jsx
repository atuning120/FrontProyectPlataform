import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import formats from "../../data/formats.json";

const COMMON_RETRO_FIELDS = ["anamnesis", "exploracion", "diagnostico"];

export default function Feedback({ recordId, initialFeedback, onSave, clinicalRecordNumber, answer }) {
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState(initialFeedback || { retroGeneral: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [clinicalRecord, setClinicalRecord] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!clinicalRecordNumber) return;
      setLoading(true);
      try {
        const { data: clinicalData } = await axios.get(`http://localhost:5000/api/clinical-records/${clinicalRecordNumber}`);
        setClinicalRecord(clinicalData);

        if (clinicalData.patientRun) {
          const { data: patientInfo } = await axios.get(`http://localhost:5000/api/patients/${clinicalData.patientRun}`);
          setPatientData(patientInfo);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clinicalRecordNumber]);

  const matchedFormat = formats.find((format) =>
    format.sections.every((section) =>
      section.fields.every((field) => Object.keys(answer || {}).includes(field.key))
    )
  );

  const retroFields = Array.from(
    new Set([
      ...COMMON_RETRO_FIELDS,
      ...(matchedFormat?.retroFields || [])
    ])
  );

  const handleSubmit = async () => {
    const isEmpty =
      typeof feedback === "string"
        ? !feedback.trim()
        : retroFields.every((key) => !feedback[key]?.trim()) && !feedback.retroGeneral?.trim();

    if (isEmpty) {
      setError("La retroalimentación no puede estar vacía.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const fullFeedback =
        retroFields.length > 0
          ? {
              ...retroFields.reduce((obj, key) => {
                obj[key] = feedback[key] || "";
                return obj;
              }, {}),
              retroGeneral: feedback.retroGeneral || "",
            }
          : feedback.retroGeneral?.trim() || "";

      await axios.put(`http://localhost:5000/api/answered-clinical-records/${recordId}`, {
        feedback: fullFeedback,
        teacherEmail: user?.email,
      });

      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar la retroalimentación.");
      console.error("Error al actualizar la retroalimentación:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLabel = (key) =>
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  // ...existing code...
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      {loading ? (
        <p className="text-gray-500">Cargando datos...</p>
      ) : (
        <>
          {patientData && (
            <div className="mb-4">
              <h3 className="text-lg font-bold">Datos del Paciente</h3>
              <p className="text-gray-700">
                <strong>RUN:</strong> {patientData.run},{" "}
                <strong>Nombre:</strong> {patientData.fullName},{" "}
                <strong>Género:</strong> {patientData.gender},{" "}
                <strong>Edad:</strong> {patientData.age},{" "}
                <strong>Seguro:</strong> {patientData.insurance},{" "}
                <strong>Dirección:</strong> {patientData.address},{" "}
                <strong>Teléfono:</strong> {patientData.mobileNumber},{" "}
                <strong>Email:</strong> {patientData.email}
              </p>
            </div>
          )}

          {clinicalRecord && (
            <div className="mb-4">
              <h3 className="text-lg font-bold">Ficha Clínica #{clinicalRecordNumber}</h3>
              <p className="text-gray-700">
                <strong>Motivo de consulta:</strong> {clinicalRecord.content}{" "}
                <strong>Fecha:</strong> {new Date(clinicalRecord.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* INICIO DE LA SECCIÓN MODIFICADA: Respuesta y Retroalimentación Integradas */}
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-3">Detalle de Respuesta y Retroalimentación</h3>
            {answer ? (
              <div className="space-y-6"> {/* Contenedor para cada ítem de respuesta + feedback */}
                {Object.entries(answer).map(([key, value]) => (
                  <div key={key} className="p-4 border rounded-lg bg-white shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 items-start">
                      {/* Columna de la Respuesta del Estudiante */}
                      <div className="md:col-span-1">
                        <p className="font-semibold capitalize text-gray-800">{formatLabel(key)}:</p>
                        <p className="text-gray-700 break-words whitespace-pre-wrap">{value}</p>
                      </div>

                      {/* Columna de Retroalimentación */}
                      <div className="md:col-span-1 mt-2 md:mt-0">
                        {/* Mostrar campo de texto para retroalimentación si es profesor, no hay feedback inicial (o no es objeto), y el campo es un retroField */}
                        {user?.role === "profesor" &&
                         !(initialFeedback && typeof initialFeedback === "object") &&
                         retroFields.includes(key) && (
                          <div>
                            <label htmlFor={`feedback-${key}`} className="block font-semibold text-sm text-gray-600 mb-1">
                              Retroalimentación para {formatLabel(key)}
                            </label>
                            <textarea
                              id={`feedback-${key}`}
                              className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              value={feedback[key] || ""}
                              onChange={(e) =>
                                setFeedback((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }))
                              }
                              placeholder={`Escribir retroalimentación...`}
                              rows="3"
                            />
                          </div>
                        )}

                        {/* Mostrar retroalimentación existente si está disponible y es específica para este campo */}
                        {initialFeedback && typeof initialFeedback === "object" && initialFeedback[key] && (
                          <div>
                            <p className="font-semibold text-sm text-gray-600">Retroalimentación ({formatLabel(key)}):</p>
                            <p className="text-gray-700 bg-gray-50 p-2 rounded break-words whitespace-pre-wrap">{initialFeedback[key]}</p>
                          </div>
                        )}
                        {/* Mensaje si se esperaba feedback específico pero no hay y no se está editando */}
                         {!(user?.role === "profesor" && !(initialFeedback && typeof initialFeedback === "object") && retroFields.includes(key)) &&
                          !(initialFeedback && typeof initialFeedback === "object" && initialFeedback[key]) &&
                           retroFields.includes(key) && (
                            <div>
                                <p className="font-semibold text-sm text-gray-600">Retroalimentación para {formatLabel(key)}:</p>
                                <p className="text-gray-500 text-sm italic">No se ha proporcionado retroalimentación específica.</p>
                            </div>
                         )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Sección para Retroalimentación General */}
                <div className="mt-6 p-4 border rounded-lg bg-white shadow">
                  <h4 className="font-semibold mb-1 text-gray-800">Retroalimentación General</h4>
                  {user?.role === "profesor" && !(initialFeedback && typeof initialFeedback === "object") && (
                    <textarea
                      className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={feedback.retroGeneral || ""}
                      onChange={(e) =>
                        setFeedback((prev) => ({
                          ...prev,
                          retroGeneral: e.target.value,
                        }))
                      }
                      placeholder="Observaciones generales..."
                      rows="4"
                    />
                  )}

                  {initialFeedback && typeof initialFeedback === "object" && initialFeedback.retroGeneral && (
                     <p className="text-gray-700 bg-gray-50 p-2 rounded break-words whitespace-pre-wrap">{initialFeedback.retroGeneral}</p>
                  )}
                  
                  {initialFeedback && typeof initialFeedback === "string" && ( // Caso de feedback general como string simple
                     <p className="text-gray-700 bg-gray-50 p-2 rounded break-words whitespace-pre-wrap">{initialFeedback}</p>
                  )}

                  {/* Mensaje si no hay retroalimentación general y no se está editando */}
                  {!(user?.role === "profesor" && !(initialFeedback && typeof initialFeedback === "object")) &&
                   !(initialFeedback && typeof initialFeedback === "object" && initialFeedback.retroGeneral) &&
                   !(initialFeedback && typeof initialFeedback === "string") && (
                     <p className="text-gray-500 text-sm italic">No hay retroalimentación general.</p>
                  )}
                </div>

                {/* Botón de Guardar */}
                {user?.role === "profesor" && !(initialFeedback && typeof initialFeedback === "object") && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Guardar Retroalimentación"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-700">No hay respuesta registrada.</p>
            )}
          </div>
          {/* FIN DE LA SECCIÓN MODIFICADA */}

          {/* Mensaje si no es profesor y no hay feedback inicial de ningún tipo */}
          {user?.role !== "profesor" && !initialFeedback && (
            <p className="text-gray-700 mt-4">Aún no se ha realizado una retroalimentación.</p>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </>
      )}
    </div>
  );
}
