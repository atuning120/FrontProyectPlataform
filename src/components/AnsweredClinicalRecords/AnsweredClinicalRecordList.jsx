import { useState, useEffect, useContext } from "react";
import axios from "axios";
import TableComponent from "../TableComponent";
import ToggleButton from "../ToggleButton";
import { AuthContext } from "../Auth/AuthProvider";
import formats from "../../data/formats.json";

export default function AnsweredClinicalRecordList({ onFeedbackSaved }) {
  const { user } = useContext(AuthContext);
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [feedbackState, setFeedbackState] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const userEmail = user?.email;
  const userRole = user?.role;

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const { data: records } = await axios.get("http://localhost:5000/api/answered-clinical-records");
        const filtered = records
          .filter((r) => {
            if (userRole === "alumno") return r.email === userEmail;
            if (userRole === "profesor") return r.email !== userEmail;
            return true;
          })
          .filter((r) =>
            filter === "all" ? true :
              filter === "with-feedback" ? !!r.feedback :
                !r.feedback
          );
        setAnsweredRecords(filtered);
      } catch (err) {
        setError("Error al cargar las respuestas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [userEmail, userRole, filter]);

  const handleToggle = (record) => {
    setSelectedRecord(selectedRecord?._id === record._id ? null : record);
  };

  const handleFeedbackChange = (key, value) => {
    setFeedbackState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmitFeedback = async (recordId) => {
    setSubmitting(true);
    try {
      await axios.put(`http://localhost:5000/api/answered-clinical-records/${recordId}`, {
        feedback: feedbackState,
        teacherEmail: user?.email,
      });
      setSelectedRecord(null);
      setFeedbackState({});
      onFeedbackSaved?.();
    } catch (err) {
      console.error("Error guardando feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const feedbackableFields = ["anamnesis", "exploracion", "diagnostico"];
  const formatLabel = (key) => key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const renderAnswersWithFeedback = (record) => {
    const format = formats.find((f) => f.id === record.formatId);
    if (!format) return <p className="text-red-500">Formato no encontrado.</p>;

    const allFields = [
      ...feedbackableFields.map(key => ({ key, label: formatLabel(key), type: "text" })),
      ...format.sections.flatMap((s) =>
        s.fields.filter(field => !feedbackableFields.includes(field.key))
      )
    ];


    return (
      <div className="space-y-6">
        {allFields.map(({ key, label, type, options = [], min, max, minLabel, maxLabel }) => {
          const value = record.answer?.[key];
          const existingFeedback = record.feedback?.[key];
          const editable = userRole === "profesor" && !record.feedback && feedbackableFields.includes(key);

          return (
            <div key={key} className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Respuesta del estudiante */}
              <div>
                <p className="font-semibold text-gray-800">{label}</p>
                {type === "checkbox_group" ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {value
                      ? <li>{value}</li>
                      : <li className="text-gray-400 italic">Sin respuesta</li>}
                  </ul>
                ) : type === "evaluation_scale" ? (
                  <div>
                    <input type="range" min={min} max={max} value={value ?? min} disabled className="w-full" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{minLabel}</span><span>{maxLabel}</span>
                    </div>
                    <p className="text-sm mt-1">Valor: <strong>{value ?? "Sin respuesta"}</strong></p>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-2 rounded text-gray-800 whitespace-pre-wrap">
                    {value?.trim() ? value : <span className="text-gray-400 italic">Sin respuesta</span>}
                  </div>
                )}
              </div>

              {/* Retroalimentación SOLO si el campo es retroalimentable */}
              {feedbackableFields.includes(key) && (
                <div>
                  <p className="font-semibold text-gray-800">Retroalimentación</p>
                  {existingFeedback ? (
                    <div className="bg-gray-50 p-2 rounded">{existingFeedback}</div>
                  ) : editable ? (
                    <textarea
                      className="w-full border rounded p-2"
                      value={feedbackState[key] || ""}
                      onChange={(e) => handleFeedbackChange(key, e.target.value)}
                      rows="3"
                      placeholder="Escribe retroalimentación..."
                    />
                  ) : userRole === "alumno" ? (
                    <p className="text-gray-400 italic">Sin retroalimentación</p>
                  ) : null}
                </div>
              )}


            </div>
          );
        })}

        {/* Retroalimentación general */}
        <div className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-800">Retroalimentación General</p>
            {record.feedback?.general ? (
              <div className="bg-gray-50 p-2 rounded">{record.feedback.general}</div>
            ) : userRole === "profesor" && !record.feedback ? (
              <textarea
                className="w-full border rounded p-2"
                value={feedbackState.general || ""}
                onChange={(e) => handleFeedbackChange("general", e.target.value)}
                rows="3"
                placeholder="Escribe retroalimentación general..."
              />
            ) : (
              <p className="text-gray-400 italic">Sin retroalimentación</p>
            )}
          </div>
        </div>

        {/* Botón de guardar si es profesor y aún no hay feedback */}
        {userRole === "profesor" && !record.feedback && (
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={submitting}
              onClick={() => handleSubmitFeedback(record._id)}
            >
              {submitting ? "Guardando..." : "Guardar Retroalimentación"}
            </button>
          </div>
        )}
      </div>
    );
  };

  const columns = [
    { key: "clinicalRecordNumber", label: "N° Ficha Clínica" },
    { key: "email", label: "Alumno" },
    {
      key: "teacherEmail", label: "Profesor",
      render: (row) => row.teacherEmail || "N/A"
    },
    {
      key: "responseTime", label: "Tiempo Invertido",
      render: (row) => row.responseTime || "N/A"
    },
    {
      key: "createdAt", label: "Hora de Envío",
      render: (row) => new Date(row.createdAt).toLocaleString()
    },
    {
      key: "updatedAt", label: "Última Actualización",
      render: (row) => new Date(row.updatedAt).toLocaleString()
    },
    {
      key: "actions", label: "Acciones",
      render: (row) => (
        <ToggleButton
          isVisible={selectedRecord?._id === row._id}
          onToggle={() => handleToggle(row)}
          showText="Detalle"
          hideText="Cerrar"
          className="bg-blue-500 text-white"
        />
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Respuestas de Atenciones Clínicas</h2>

      <div className="mb-4">
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="with-feedback">Con Retroalimentación</option>
          <option value="without-feedback">Sin Retroalimentación</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando respuestas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : answeredRecords.length === 0 ? (
        <p>No hay respuestas registradas que coincidan con el filtro.</p>
      ) : (
        <>
          <TableComponent columns={columns} data={answeredRecords} />
          {selectedRecord && userRole !== "admin" && (
            <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">
                Ficha Clínica #{selectedRecord.clinicalRecordNumber} de {selectedRecord.email}
              </h3>
              {renderAnswersWithFeedback(selectedRecord)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
