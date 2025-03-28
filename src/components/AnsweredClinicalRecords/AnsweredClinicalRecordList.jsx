import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ToggleButton from "../ToggleButton";
import Feedback from "./Feedback";
import { AuthContext } from "../Auth/AuthProvider";

export default function AnsweredClinicalRecordList({ onFeedbackSaved }) {
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [patientsData, setPatientsData] = useState({});
  const [clinicalRecordsData, setClinicalRecordsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFeedback, setShowFeedback] = useState({});
  
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;
  const userRole = user?.role;

  useEffect(() => {
    const fetchAnsweredRecords = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/answered-clinical-records");
        const records = response.data;

        // Filtrar las respuestas dependiendo del rol
        const filteredRecords = records.filter(record => {
          if (userRole === "alumno") {
            // Los estudiantes ven solo sus respuestas
            return record.email === userEmail;
          }
          if (userRole === "profesor") {
            // Los profesores ven todas las respuestas excepto las que ellos mismos han respondido
            return record.email !== userEmail;
          }
          return false;
        });

        setAnsweredRecords(filteredRecords);

        for (const record of filteredRecords) {
          try {
            const clinicalRecordResponse = await axios.get(`http://localhost:5000/api/clinical-records/${record.clinicalRecordNumber}`);
            const clinicalRecord = clinicalRecordResponse.data;

            const patientResponse = await axios.get(`http://localhost:5000/api/patients/${clinicalRecord.patientRun}`);
            const patient = patientResponse.data;

            setClinicalRecordsData((prevData) => ({
              ...prevData,
              [record._id]: clinicalRecord,
            }));
            setPatientsData((prevData) => ({
              ...prevData,
              [record._id]: patient,
            }));
          } catch (error) {
            console.error("Error al obtener los datos de la ficha clínica o paciente:", error);
          }
        }
      } catch (err) {
        setError("Error al cargar las respuestas.");
        console.error("Error al cargar las respuestas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnsweredRecords();
  }, [userEmail, userRole]);

  const toggleFeedback = (recordId) => {
    setShowFeedback((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  const handleSaveFeedback = (recordId) => {
    setShowFeedback((prev) => ({
      ...prev,
      [recordId]: false,
    }));

    alert("¡Retroalimentación guardada exitosamente!");
    if (onFeedbackSaved) {
      onFeedbackSaved(); // Llamamos a la función pasada desde TeacherPage
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Respuestas de Fichas Clínicas</h2>

      {answeredRecords.length === 0 ? (
        <p>No hay respuestas registradas.</p>
      ) : (
        answeredRecords.map((record) => {
          const patient = patientsData[record._id];
          const clinicalRecord = clinicalRecordsData[record._id];

          return (
            <div key={record._id} className="border p-4 mb-4 rounded-lg shadow-sm bg-gray-50">
              {clinicalRecord && patient && (
                <div className="mb-4">
                  <p><strong>N° Ficha Clínica:</strong> {clinicalRecord.clinicalRecordNumber}</p>
                  <p><strong>RUN:</strong> {patient.run} <strong>Nombre:</strong> {patient.fullName} <strong>Edad:</strong> {patient.age} <strong>Género:</strong> {patient.gender} <strong>Dirección:</strong> {patient.address} <strong>Email:</strong> {patient.email}</p>
                  <p><strong>Fecha de Creación:</strong> {new Date(clinicalRecord.createdAt).toLocaleString()}</p>
                  <p><strong>Descripción:</strong> {clinicalRecord.content}</p>
                </div>
              )}

              <div className="mb-4">
                <p><strong>Alumno:</strong> {record.email} <strong>Respuesta:</strong> {record.answer}</p>
                {record.feedback && (
                  <p className="text-green-700 mt-2"><strong>Retroalimentación:</strong> {record.feedback}</p>
                )}
              </div>

              {userRole === "profesor" && (
                <ToggleButton
                  isVisible={showFeedback[record._id]}
                  onToggle={() => toggleFeedback(record._id)}
                  showText="Dar Retroalimentación"
                  hideText="Cancelar"
                  className={`mt-2 w-full ${showFeedback[record._id] ? "bg-red-500" : "bg-blue-500"} text-white py-2 rounded-lg`}
                />
              )}

              {userRole === "profesor" && showFeedback[record._id] && (
                <Feedback 
                  recordId={record._id} 
                  initialFeedback={record.feedback}
                  onSave={() => handleSaveFeedback(record._id)}  
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
