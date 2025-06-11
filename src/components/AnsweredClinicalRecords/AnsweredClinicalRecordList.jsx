import { useState, useEffect, useContext } from "react";
import axios from "axios";
import TableComponent from "../TableComponent";
import ToggleButton from "../ToggleButton";
import { AuthContext } from "../Auth/AuthProvider";
import formatsData from "../../data/formats.json";

export default function AnsweredClinicalRecordList({ onFeedbackSaved }) {
  const { user } = useContext(AuthContext);
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [filterByProfessor, setFilterByProfessor] = useState("");
  const [filterByRecordNumber, setFilterByRecordNumber] = useState("");
  const [filterByDate, setFilterByDate] = useState("");
  const [sortByDate, setSortByDate] = useState("desc");
  const [feedbackState, setFeedbackState] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const userEmail = user?.email;
  const userRole = user?.role;

  /* -------------------------------------------------- */
  /* Carga de registros con filtros                      */
  /* -------------------------------------------------- */
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const { data: records } = await axios.get(
          "http://localhost:5000/api/answered-clinical-records"
        );

        let filtered = records
          .filter((r) => {
            if (userRole === "alumno") return r.email === userEmail;
            if (userRole === "profesor") return r.email !== userEmail;
            return true;
          })
          .filter((r) => {
            if (filter === "all") return true;
            const hasFeedback =
              r.feedback && (Object.keys(r.feedback).length > 0 || r.feedback.general);
            return filter === "with-feedback" ? hasFeedback : !hasFeedback;
          });

        if (filterByProfessor) {
          filtered = filtered.filter((r) => r.teacherEmail === filterByProfessor);
        }
        if (filterByRecordNumber) {
          filtered = filtered.filter((r) =>
            r.clinicalRecordNumber.toString().includes(filterByRecordNumber)
          );
        }
        if (filterByDate) {
          filtered = filtered.filter((r) => {
            const recordDate = new Date(r.createdAt).toISOString().split("T")[0];
            return recordDate === filterByDate;
          });
        }

        filtered = filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortByDate === "asc" ? dateA - dateB : dateB - dateA;
        });

        setAnsweredRecords(filtered);
      } catch (err) {
        setError("Error al cargar las respuestas. Intente de nuevo más tarde.");
        console.error("Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [
    userEmail,
    userRole,
    filter,
    filterByProfessor,
    filterByRecordNumber,
    filterByDate,
    sortByDate,
    onFeedbackSaved,
  ]);

  /* -------------------------------------------------- */
  /* Handlers de UI                                      */
  /* -------------------------------------------------- */
  const handleToggle = (record) => {
    if (selectedRecord?._id === record._id) {
      setSelectedRecord(null);
      setFeedbackState({});
    } else {
      setSelectedRecord(record);
      setFeedbackState(record.feedback || {});
    }
  };

  const handleFeedbackChange = (key, value) => {
    setFeedbackState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitFeedback = async (recordId) => {
    if (Object.keys(feedbackState).length === 0) {
      setError("No hay retroalimentación para guardar.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/answered-clinical-records/${recordId}`,
        {
          feedback: feedbackState,
          teacherEmail: user?.email,
        }
      );

      setSelectedRecord((prev) => ({
        ...prev,
        feedback: { ...feedbackState },
        teacherEmail: user?.email,
        updatedAt: response.data.updatedAt,
      }));

      if (onFeedbackSaved) onFeedbackSaved();
    } catch (err) {
      setError("Error al guardar la retroalimentación.");
      console.error("Error saving feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------------------------------------- */
  /* Render helpers                                      */
  /* -------------------------------------------------- */
  const feedbackableBaseFields = ["anamnesis", "exploracion", "diagnostico"];
  const formatLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const uniqueProfessors = [
    ...new Set(answeredRecords.map((r) => r.teacherEmail).filter(Boolean)),
  ];

  const renderAnswersWithFeedback = (record) => {
    if (!record || !record.answer)
      return <p className="text-red-500">Datos de la respuesta no disponibles.</p>;

    const { baseFields, formatSpecificAnswers } = record.answer;
    const currentFeedback = record.feedback || {};

    return (
      <div className="space-y-6">
        {/* ------------------- Campos Base ------------------- */}
        <div className="p-4 bg-gray-50 rounded-md shadow">
          <h4 className="text-md font-semibold mb-3 text-blue-600">Campos Base</h4>
          {feedbackableBaseFields.map((key) => {
            const value = baseFields?.[key];
            const isEditingFeedback =
              userRole === "profesor" &&
              (!currentFeedback[key] || feedbackState.hasOwnProperty(key));

            return (
              <div
                key={`base-${key}`}
                className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
              >
                <div>
                  <p className="font-semibold text-gray-800">{formatLabel(key)}</p>
                  <div className="bg-gray-100 p-2 rounded text-gray-800 whitespace-pre-wrap mt-1 min-h-[60px]">
                    {value?.trim() ? value : <span className="text-gray-400 italic">Sin respuesta</span>}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Retroalimentación</p>
                  {currentFeedback[key] && !feedbackState.hasOwnProperty(key) ? (
                    <div className="bg-green-50 p-2 rounded mt-1 whitespace-pre-wrap min-h-[60px]">
                      {currentFeedback[key]}
                    </div>
                  ) : isEditingFeedback ? (
                    <textarea
                      className="w-full border rounded p-2 mt-1"
                      value={feedbackState[key] || ""}
                      onChange={(e) => handleFeedbackChange(key, e.target.value)}
                      rows="3"
                      placeholder={`Retroalimentación para ${formatLabel(key)}...`}
                    />
                  ) : (
                    <p className="text-gray-400 italic mt-1 min-h-[60px]">
                      {userRole === "alumno" && !currentFeedback[key]
                        ? "Sin retroalimentación"
                        : currentFeedback[key] || "No aplica"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------- Campos Específicos por Formato ------------- */}
        {record.formatIds &&
          record.formatIds.map((formatId) => {
            const format = formatsData.find((f) => f.id === formatId);
            if (!format)
              return (
                <p key={`format-error-${formatId}`} className="text-red-500">
                  Definición del formato ID {formatId} no encontrada.
                </p>
              );

            const specificAnswers = formatSpecificAnswers?.[formatId];

            return (
              <div
                key={`format-${formatId}`}
                className="p-4 bg-gray-50 rounded-md shadow mt-4"
              >
                <h4 className="text-md font-semibold mb-3 text-purple-600">
                  {format.name}
                </h4>

                {!specificAnswers ? (
                  <p className="text-gray-500 italic">No hay respuestas para este formato.</p>
                ) : (
                  (format.sections || [])
                    .flatMap((section) => section.fields || [])
                    .map((field) => {
                      const {
                        key,
                        label,
                        type,
                        options = [],
                        min,
                        max,
                        minLabel,
                        maxLabel,
                      } = field;
                      const value = specificAnswers[key];

                      return (
                        <div
                          key={`format-${formatId}-field-${key}`}
                          className="bg-white p-3 rounded shadow mb-3"
                        >
                          <p className="font-semibold text-gray-700">{label}</p>

                          {/* ------------ CHECKBOX GROUP ------------ */}
                          {type === "checkbox_group" ? (
                            <div className="mt-1">
                              {value ? (
                                <span className="text-gray-800">
                                  {Array.isArray(value) ? value.join(", ") : value}
                                </span>
                              ) : (
                                <span className="text-gray-400 italic">Sin respuesta</span>
                              )}
                            </div>

                            /* ----------------- ESCALA ----------------- */
                          ) : type === "evaluation_scale" ? (
                            <div className="mt-1">
                              <input
                                type="range"
                                min={min}
                                max={max}
                                value={value ?? min}
                                disabled
                                className="w-full cursor-not-allowed"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>
                                  {minLabel || "Min"} ({min})
                                </span>
                                <span>
                                  {maxLabel || "Max"} ({max})
                                </span>
                              </div>
                              <p className="text-sm mt-1">
                                Valor:{" "}
                                <strong>
                                  {value ?? (
                                    <span className="text-gray-400 italic">Sin respuesta</span>
                                  )}
                                </strong>
                              </p>
                            </div>

                            /* --------------- IMAGE RADIO -------------- */
                          ) : type?.trim() === "image_radio" ? (
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                              {options.map(({ value: optValue, label: optLabel, image: imgPath }) => {
                                const isChecked = value === optValue;
                                return (
                                  <div
                                    key={optValue}
                                    className={`relative border rounded-lg p-2 shadow-sm ${isChecked
                                      ? "border-blue-600 ring-2 ring-blue-400"
                                      : "border-gray-200"
                                      }`}
                                  >
                                    <img
                                      src={imgPath}
                                      alt={optLabel}
                                      className="w-full h-28 object-contain select-none pointer-events-none"
                                    />
                                    <p className="mt-2 text-sm text-center text-gray-700">
                                      {optLabel}
                                    </p>
                                    {isChecked && (
                                      <span className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-1">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                              {!value && (
                                <p className="col-span-full text-center italic text-gray-400">
                                  Sin respuesta
                                </p>
                              )}
                            </div>

                            /* ---------------- DEFAULT ----------------- */
                          ) : (
                            <div className="bg-gray-100 p-2 rounded text-gray-800 whitespace-pre-wrap mt-1 min-h-[60px]">
                              {value?.trim() ? (
                                value
                              ) : (
                                <span className="text-gray-400 italic">Sin respuesta</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            );
          })}

        {/* ------------------ Feedback General ------------------ */}
        <div className="bg-white p-4 rounded shadow mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <p className="font-semibold text-gray-800">Retroalimentación General</p>
          </div>
          <div>
            {currentFeedback.general && !feedbackState.hasOwnProperty("general") ? (
              <div className="bg-green-50 p-2 rounded mt-1 whitespace-pre-wrap min-h-[60px]">
                {currentFeedback.general}
              </div>
            ) : userRole === "profesor" &&
              (!currentFeedback.general || feedbackState.hasOwnProperty("general")) ? (
              <textarea
                className="w-full border rounded p-2"
                value={feedbackState.general || ""}
                onChange={(e) => handleFeedbackChange("general", e.target.value)}
                rows="3"
                placeholder="Escribe retroalimentación general..."
              />
            ) : (
              <p className="text-gray-400 italic mt-1 min-h-[60px]">
                {currentFeedback.general || "Sin retroalimentación general"}
              </p>
            )}
          </div>
        </div>

        {userRole === "profesor" &&
          (Object.keys(feedbackState).length > 0 ||
            !currentFeedback ||
            Object.keys(currentFeedback).length === 0) && (
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-60"
                disabled={submitting || Object.keys(feedbackState).length === 0}
                onClick={() => handleSubmitFeedback(record._id)}
              >
                {submitting ? "Guardando..." : "Guardar Retroalimentación"}
              </button>
            </div>
          )}
      </div>
    );
  };

  /* -------------------------------------------------- */
  /* Columnas de la tabla                                */
  /* -------------------------------------------------- */
  const columns = [
    { key: "clinicalRecordNumber", label: "N° Ficha" },
    {
      key: "email",
      label: "Alumno",
      render: (row) => (
        <span title={row.email}>
          {row.email.length > 20 ? `${row.email.substring(0, 17)}...` : row.email}
        </span>
      ),
    },
    {
      key: "formatNames",
      label: "Formatos",
      render: (row) => {
        if (!row.formatIds || row.formatIds.length === 0) return "N/A";
        const names = row.formatIds
          .map((id) => {
            const format = formatsData.find((f) => f.id === id);
            return format ? format.name : `ID ${id}`;
          })
          .join(", ");
        return (
          <span title={names}>{names.length > 25 ? `${names.substring(0, 22)}...` : names}</span>
        );
      },
    },
    {
      key: "teacherEmail",
      label: "Profesor",
      render: (row) =>
        row.teacherEmail ? (
          <span title={row.teacherEmail}>
            {row.teacherEmail.length > 20
              ? `${row.teacherEmail.substring(0, 17)}...`
              : row.teacherEmail}
          </span>
        ) : (
          "N/A"
        ),
    },
    { key: "responseTime", label: "T. Invertido", render: (row) => row.responseTime || "N/A" },
    {
      key: "createdAt",
      label: "Envío",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "feedbackStatus",
      label: "Feedback",
      render: (row) =>
        row.feedback && (Object.keys(row.feedback).length > 0 || row.feedback.general) ? (
          <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
            Completo
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
            Pendiente
          </span>
        ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row) => (
        <ToggleButton
          isVisible={selectedRecord?._id === row._id}
          onToggle={() => handleToggle(row)}
          showText="Detalle"
          hideText="Cerrar"
          className={`px-3 py-1 text-sm rounded-md ${selectedRecord?._id === row._id
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
        />
      ),
    },
  ];

  /* -------------------------------------------------- */
  /* Render principal                                    */
  /* -------------------------------------------------- */
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Respuestas de Atenciones Clínicas
      </h2>

      {/* ---------- Filtros ---------- */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="mb-6 flex flex-wrap gap-4">
          {/* Feedback */}
          <select
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todas las Respuestas</option>
            <option value="with-feedback">Con Retroalimentación</option>
            <option value="without-feedback">Sin Retroalimentación</option>
          </select>

          {/* Profesor */}
          <select
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
            value={filterByProfessor}
            onChange={(e) => setFilterByProfessor(e.target.value)}
          >
            <option value="">Todos los Profesores</option>
            {uniqueProfessors.map((professor) => (
              <option key={professor} value={professor}>
                {professor}
              </option>
            ))}
          </select>

          {/* N° Ficha */}
          <input
            type="text"
            placeholder="Filtrar por N° Ficha"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
            value={filterByRecordNumber}
            onChange={(e) => setFilterByRecordNumber(e.target.value)}
          />

          {/* Fecha */}
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
            value={filterByDate}
            onChange={(e) => setFilterByDate(e.target.value)}
          />

          {/* Orden */}
          <select
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
            value={sortByDate}
            onChange={(e) => setSortByDate(e.target.value)}
          >
            <option value="desc">Fecha: Más reciente</option>
            <option value="asc">Fecha: Más antigua</option>
          </select>
        </div>

        {error && (
          <div className="w-full sm:w-auto text-sm text-red-600 bg-red-100 p-2 rounded-md text-center sm:text-left">
            {error}
          </div>
        )}
      </div>

      {/* ---------- Tabla + Detalle ---------- */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Cargando respuestas...</p>
        </div>
      ) : answeredRecords.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            No hay respuestas registradas que coincidan con los filtros aplicados.
          </p>
        </div>
      ) : (
        <>
          <TableComponent columns={columns} data={answeredRecords} />
          {selectedRecord && (
            <div className="mt-8 p-4 md:p-6 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Detalle Ficha Clínica #{selectedRecord.clinicalRecordNumber}
                  <span className="text-base font-normal text-gray-600">
                    {" "}
                    (Alumno: {selectedRecord.email})
                  </span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedRecord(null);
                    setFeedbackState({});
                    setError("");
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  title="Cerrar detalle"
                >
                  &times;
                </button>
              </div>
              {renderAnswersWithFeedback(selectedRecord)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
