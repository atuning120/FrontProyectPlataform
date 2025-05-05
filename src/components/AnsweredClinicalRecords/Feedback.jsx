import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import formats from "../../data/formats.json";

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

  const retroFields = matchedFormat?.retroFields || [];

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

          <div className="mb-4">
            <h3 className="text-lg font-bold">Respuesta</h3>
            {answer ? (
              <div className="bg-white p-4 rounded-lg shadow">
                {Object.entries(answer).map(([key, value], index) => (
                  <p key={index} className="mb-2">
                    <strong className="capitalize">{formatLabel(key)}:</strong> {value}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-700">No hay respuesta registrada.</p>
            )}
          </div>

          <h3 className="text-lg font-bold">Retroalimentación</h3>
          {initialFeedback && typeof initialFeedback === "object" ? (
            <div className="bg-white p-4 rounded-lg shadow">
              {Object.entries(initialFeedback).map(([key, val], idx) => (
                <p key={idx}><strong>{formatLabel(key)}:</strong> {val}</p>
              ))}
            </div>
          ) : user?.role === "profesor" ? (
            <div className="flex flex-col space-y-4">
              {retroFields.map((fieldKey, index) => (
                <div key={index}>
                  <label className="block font-semibold capitalize">{formatLabel(fieldKey)}</label>
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    value={feedback[fieldKey] || ""}
                    onChange={(e) =>
                      setFeedback((prev) => ({
                        ...prev,
                        [fieldKey]: e.target.value,
                      }))
                    }
                    placeholder={`Retroalimentación sobre ${formatLabel(fieldKey)}`}
                  />
                </div>
              ))}

              <div>
                <label className="block font-semibold">Retroalimentación General</label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  value={feedback.retroGeneral || ""}
                  onChange={(e) =>
                    setFeedback((prev) => ({
                      ...prev,
                      retroGeneral: e.target.value,
                    }))
                  }
                  placeholder="Observaciones generales..."
                />
              </div>

              <button
                onClick={handleSubmit}
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
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
