import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ToggleButton from "../ToggleButton";
import Feedback from "./Feedback";
import { AuthContext } from "../Auth/AuthProvider";

export default function AnsweredClinicalRecordList({ onFeedbackSaved }) {
  const { user } = useContext(AuthContext);
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [dataMap, setDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFeedback, setShowFeedback] = useState({});
  const [filter, setFilter] = useState("all");

  const userEmail = user?.email;
  const userRole = user?.role;

  useEffect(() => {
    const fetchAnsweredRecords = async () => {
      setLoading(true);
      try {
        const { data: records } = await axios.get("http://localhost:5000/api/answered-clinical-records");

        // Filtrar respuestas según rol
        const filteredRecords = records.filter(record =>
          userRole === "alumno" ? record.email === userEmail :
          userRole === "profesor" ? record.email !== userEmail : false
        ).filter(record =>
          filter === "all" ? true :
          filter === "with-feedback" ? !!record.feedback :
          !record.feedback
        );

        setAnsweredRecords(filteredRecords);

        // Obtener datos adicionales (fichas clínicas y pacientes) en paralelo
        const fetchedData = await Promise.all(filteredRecords.map(async (record) => {
          try {
            const { data: clinicalRecord } = await axios.get(`http://localhost:5000/api/clinical-records/${record.clinicalRecordNumber}`);
            const { data: patient } = await axios.get(`http://localhost:5000/api/patients/${clinicalRecord.patientRun}`);
            return { [record._id]: { clinicalRecord, patient } };
          } catch (error) {
            console.error("Error al obtener ficha clínica o paciente:", error);
            return {};
          }
        }));

        setDataMap(fetchedData.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
      } catch (err) {
        setError("Error al cargar las respuestas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnsweredRecords();
  }, [userEmail, userRole, filter]);

  const toggleFeedback = (recordId) => {
    setShowFeedback(prev => ({ ...prev, [recordId]: !prev[recordId] }));
  };

  const handleSaveFeedback = (recordId) => {
    setShowFeedback(prev => ({ ...prev, [recordId]: false }));
    alert("¡Retroalimentación guardada exitosamente!");
    onFeedbackSaved?.();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Respuestas de Fichas Clínicas</h2>

      <div className="mb-4">
        <select className="p-2 border rounded" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Todas</option>
          <option value="with-feedback">Con Retroalimentación</option>
          <option value="without-feedback">Sin Retroalimentación</option>
        </select>
      </div>

      {loading ? <p>Cargando respuestas...</p> :
        answeredRecords.length === 0 ? <p>No hay respuestas registradas.</p> :
          answeredRecords.map(record => {
            const { clinicalRecord, patient } = dataMap[record._id] || {};

            return (
              <div key={record._id} className="border p-4 mb-4 rounded-lg shadow-sm bg-gray-50">
                {clinicalRecord && patient && (
                  <div className="mb-4">
                    <p><strong>N° Ficha Clínica:</strong> {clinicalRecord.clinicalRecordNumber}</p>
                    <p><strong>RUN:</strong> {patient.run} <strong>Nombre:</strong> {patient.fullName}</p>
                    <p><strong>Edad:</strong> {patient.age} <strong>Género:</strong> {patient.gender}</p>
                    <p><strong>Dirección:</strong> {patient.address} <strong>Email:</strong> {patient.email}</p>
                    <p><strong>Fecha de Creación:</strong> {new Date(clinicalRecord.createdAt).toLocaleString()}</p>
                    <p><strong>Descripción:</strong> {clinicalRecord.content}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p><strong>Alumno:</strong> {record.email} <strong>Respuesta:</strong> {record.answer}</p>
                  {record.feedback && <p className="text-green-700 mt-2"><strong>Retroalimentación:</strong> {record.feedback}</p>}
                </div>

                {userRole === "profesor" && !record.feedback && (
                  <ToggleButton
                    isVisible={showFeedback[record._id]}
                    onToggle={() => toggleFeedback(record._id)}
                    showText="Dar Retroalimentación"
                    hideText="Cancelar"
                    className={`mt-2 w-full ${showFeedback[record._id] ? "bg-red-500" : "bg-blue-500"} text-white py-2 rounded-lg`}
                  />
                )}

                {userRole === "profesor" && showFeedback[record._id] && (
                  <Feedback recordId={record._id} initialFeedback={record.feedback} onSave={() => handleSaveFeedback(record._id)} />
                )}
              </div>
            );
          })}
    </div>
  );
}
