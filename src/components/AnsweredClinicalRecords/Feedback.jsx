import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";

export default function Feedback({ recordId, initialFeedback, onSave, clinicalRecordNumber, answer }) {
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState(initialFeedback || "");
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

  const handleFeedbackChange = useCallback((e) => setFeedback(e.target.value), []);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setError("La retroalimentación no puede estar vacía.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await axios.put(`http://localhost:5000/api/answered-clinical-records/${recordId}`, {
        feedback: feedback.trim(),
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

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      {/* Datos del Paciente */}
      {loading ? (
        <p className="text-gray-500">Cargando datos...</p>
      ) : (
        <>
          {patientData ? (
            <div className="mb-4">
              <h3 className="text-lg font-bold">Datos del Paciente</h3>
              <p className="text-gray-700">
                <strong>RUN:</strong> {patientData.run},  
                <strong> Nombre:</strong> {patientData.fullName},  
                <strong> Género:</strong> {patientData.gender},  
                <strong> Edad:</strong> {patientData.age},  
                <strong> Seguro:</strong> {patientData.insurance},  
                <strong> Dirección:</strong> {patientData.address},  
                <strong> Teléfono:</strong> {patientData.mobileNumber},  
                <strong> Email:</strong> {patientData.email}
              </p>
            </div>
          ) : (
            <p className="text-red-500">No se pudieron obtener los datos del paciente.</p>
          )}

          {/* Datos de la Ficha Clínica */}
          {clinicalRecord ? (
            <div className="mb-4">
              <h3 className="text-lg font-bold">Ficha Clínica #{clinicalRecordNumber}</h3>
              <p className="text-gray-700">
                <strong>Motivo de consulta:</strong> {clinicalRecord.content}  
                <strong> Fecha:</strong> {new Date(clinicalRecord.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-red-500">No se pudo obtener la ficha clínica.</p>
          )}

          {/* Respuesta */}
          <div className="mb-4">
            <h3 className="text-lg font-bold">Respuesta</h3>
            {answer ? (
              <div className="bg-white p-4 rounded-lg shadow">
                {Object.entries(answer).map(([key, value], index) => (
                  <p key={index} className="mb-2">
                    <strong className="capitalize">{key.replace(/_/g, " ")}:</strong> {value}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-700">No hay respuesta registrada.</p>
            )}
          </div>

          {/* Retroalimentación */}
          <h3 className="text-lg font-bold">Retroalimentación</h3>
          {initialFeedback ? (
            <p className="text-gray-700 bg-white p-4 rounded-lg shadow">{initialFeedback}</p>
          ) : user?.role === "profesor" ? (
            <div className="flex flex-col space-y-2">
              <textarea
                className="w-full p-2 border rounded-lg"
                value={feedback}
                onChange={handleFeedbackChange}
              />
              <button
                onClick={handleSubmit}
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                  (!feedback.trim() || isSubmitting) ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!feedback.trim() || isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Guardar Retroalimentación"}
              </button>
            </div>
          ) : (
            <p className="text-gray-700">Aún no se ha realizado una retroalimentación.</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
