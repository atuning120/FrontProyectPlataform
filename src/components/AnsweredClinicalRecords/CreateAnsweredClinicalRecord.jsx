import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import { useFormatForm } from "./useFormatForm";
import formatsData from "../../data/formats.json";

export default function CreateAnsweredClinicalRecords({
  clinicalRecordNumber,
  patientRun,
  onSubmit,
  onPatientLoaded,
  setNotification,
}) {
  const { user } = useContext(AuthContext);

  /* ---------------- estado local ---------------- */
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

  /* ---------------- cargar datos paciente ---------------- */
  useEffect(() => {
    setStartTime(Date.now());

    const fetchPatientData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/patients/${patientRun}`,
        );
        setPatientData(data);
        onPatientLoaded?.(data.fullName);
      } catch (err) {
        setError("Error obteniendo los datos del paciente.");
        console.error(err);
      }
    };

    if (patientRun) fetchPatientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientRun, clinicalRecordNumber]);

  /* ---------------- helpers ---------------- */
  const formatDuration = (ms) => {
    const s = Math.floor(ms / 1_000);
    const hh = String(Math.floor(s / 3600)).padStart(2, "0");
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const allBaseFieldsFilled = Object.values(baseFields).every(
    (v) => v.trim() !== "",
  );

  const validateAnswers = () => {
    if (!allBaseFieldsFilled || selectedFormats.length === 0) return false;

    for (const format of selectedFormats) {
      const answers = responses[format.id] || {};
      for (const section of format.sections ?? []) {
        for (const field of section.fields ?? []) {
          const value = answers[field.key];

          switch (field.type) {
            case "checkbox_group":
            case "image_radio":
              if (!value) return false;
              break;
            case "evaluation_scale":
              if (value === null || value === undefined) return false;
              break;
            default:
              if (!value || String(value).trim() === "") return false;
          }
        }
      }
    }
    return true;
  };

  /* ---------------- submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAnswers()) {
      setError(
        "Completa los campos base y todos los campos de los formatos seleccionados antes de enviar.",
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      const duration = formatDuration(Date.now() - startTime);

      await axios.post("http://localhost:5000/api/answered-clinical-records", {
        clinicalRecordNumber,
        clinicalRecordName: selectedFormats.map((f) => f.name).join(", "),
        email: user.email,
        answer: {
          baseFields,
          formatSpecificAnswers: responses,
        },
        formatIds: selectedFormats.map((f) => f.id),
        responseTime: duration,
      });

      setNotification?.({ message: "Respuesta enviada con éxito.", type: "success" });
      onSubmit?.();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Hubo un error al enviar la respuesta. Intenta nuevamente.",
      );
      setNotification?.({ message: "Hubo un error al enviar la respuesta. Intenta nuevamente.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- render ---------------- */
  return (
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
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
          {/* ---------- campos base ---------- */}
          <div className="mb-4 space-y-4 p-4 bg-white rounded shadow">
            <h3 className="text-lg font-bold mb-2">Campos Base</h3>
            {[
              { key: "anamnesis", label: "Anamnesis" },
              { key: "exploracion", label: "Exploración" },
              { key: "diagnostico", label: "Diagnóstico" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label htmlFor={key} className="block mb-1 font-medium">
                  {label}
                </label>
                <textarea
                  id={key}
                  value={baseFields[key]}
                  onChange={(e) =>
                    setBaseFields({ ...baseFields, [key]: e.target.value })
                  }
                  required
                  rows="3"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}
          </div>

          {/* ---------- selección de formatos ---------- */}
          {allBaseFieldsFilled && (
            <div className="mb-4 p-4 bg-white rounded shadow">
              <h3 className="text-lg font-semibold mb-2">
                Seleccionar Formatos de Ficha Clínica
              </h3>
              {formatsData.map((format) => (
                <label
                  key={format.id}
                  className="flex items-center gap-2 mb-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFormats.some((f) => f.id === format.id)}
                    onChange={(e) =>
                      handleFormatSelectionChange(format.id, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  {format.name}
                </label>
              ))}
            </div>
          )}

          {/* ---------- render dinámico de cada formato ---------- */}
          {selectedFormats.map((format) => {
            const answers = responses[format.id] || {};
            return (
              <div
                key={format.id}
                className="mb-8 p-4 border rounded-md shadow-sm bg-white"
              >
                <h2 className="text-xl font-bold mb-4 text-blue-700">
                  {format.name}
                </h2>

                {(format.sections ?? []).map((section, sIdx) => (
                  <div key={`${format.id}-section-${sIdx}`} className="mb-6">
                    {section.section && (
                      <h3 className="text-lg font-semibold mb-2">
                        {section.section}
                      </h3>
                    )}
                    {(section.fields ?? []).map((field) => {
                      const {
                        key,
                        label,
                        type = "text", // Default to "text" if type is undefined
                        options = [],
                        min = 0,
                        max = 10,
                        minLabel = "Min",
                        maxLabel = "Max",
                      } = field;
                      const value = answers[key];
                      const name = `${format.id}-${key}`;
                      const idPrefix = `field-${name}`;

                      /* ---------- UI por tipo ---------- */
                      return (
                        <div key={idPrefix} className="mb-4">
                          <label className="block mb-1 font-medium">{label}</label>

                          {/* ----- checkbox_group ----- */}
                          {type === "checkbox_group" && (
                            <div className="space-y-1">
                              {options.map((opt, idx) => (
                                <label
                                  key={`${idPrefix}-${idx}`}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    name={name}
                                    checked={value === opt}
                                    onChange={() =>
                                      handleInputChange(format.id, key, opt)
                                    }
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          )}

                          {/* ----- evaluation_scale ----- */}
                          {type === "evaluation_scale" && (
                            <>
                              <input
                                type="range"
                                min={min}
                                max={max}
                                value={value ?? min}
                                onChange={(e) =>
                                  handleInputChange(
                                    format.id,
                                    key,
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                              />
                              <div className="flex justify-between text-sm mt-1 text-gray-600">
                                <span>
                                  {minLabel} ({min})
                                </span>
                                <span>
                                  {maxLabel} ({max})
                                </span>
                              </div>
                              <div className="text-center mt-1">
                                Valor: <strong>{value ?? min}</strong>
                              </div>
                            </>
                          )}

                          {/* ----- image_radio ----- */}
                          {type === "image_radio" && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              {options.map((opt, idx) => (
                                <label
                                  key={`${idPrefix}-${idx}`}
                                  className="cursor-pointer text-center"
                                >
                                  <input
                                    type="radio"
                                    name={name}
                                    className="sr-only"
                                    checked={value === opt.value}
                                    onChange={() =>
                                      handleInputChange(
                                        format.id,
                                        key,
                                        opt.value,
                                      )
                                    }
                                  />
                                  <img
                                    src={opt.image}
                                    alt={opt.label}
                                    className={`w-full h-24 object-contain border-2 rounded-md ${value === opt.value
                                      ? "border-blue-500 ring-2 ring-blue-400"
                                      : "border-transparent"
                                      }`}
                                  />
                                  <span className="block mt-1 text-sm">
                                    {opt.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}

                          {/* ----- cuadro de texto para type "text" ----- */}
                          {type === "text" && (
                            <textarea
                              value={value || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  format.id,
                                  key,
                                  e.target.value,
                                )
                              }
                              required
                              rows="3"
                              className="w-full p-2 border rounded-md"
                            />
                          )}
                          {/* ----- pain_scale ----- */}
                          {type === "pain_scale" && (
                            <div className="flex gap-x-4">
                              {options.map((opt, idx) => (
                                <label
                                  key={`${idPrefix}-${idx}`}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    name={name}
                                    value={opt}
                                    checked={value === opt}
                                    onChange={() => handleInputChange(format.id, key, opt)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}

          {/* ---------- botón submit ---------- */}
          {allBaseFieldsFilled && selectedFormats.length > 0 && (
            <button
              type="submit"
              disabled={loading || !validateAnswers()}
              className={`w-full p-3 rounded-md text-white ${loading || !validateAnswers()
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {loading ? "Enviando..." : "Enviar Respuesta"}
            </button>

          )}
        </form>
      </div>
  );
}
