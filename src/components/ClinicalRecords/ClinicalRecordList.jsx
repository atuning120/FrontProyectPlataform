import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import DeleteClinicalRecord from "./DeleteClinicalRecord";
import CreateAnsweredClinicalRecords from "../AnsweredClinicalRecords/CreateAnsweredClinicalRecord";
import FindAnsweredClinicalRecordByEmail from "../AnsweredClinicalRecords/FindAnsweredClinicalRecordByEmail";

export default function ClinicalRecordList({ onResponseSubmitted }) {
  const { user } = useContext(AuthContext);
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [patientData, setPatientData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClinicalRecords = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clinical-records");
        setClinicalRecords(response.data);

        const patientDataMap = {};
        for (let record of response.data) {
          if (!patientDataMap[record.patientRun]) {
            const patientResponse = await axios.get(`http://localhost:5000/api/patients/${record.patientRun}`);
            patientDataMap[record.patientRun] = patientResponse.data;
          }
        }
        setPatientData(patientDataMap);
      } catch (error) {
        setError("No se pudieron obtener las fichas clínicas o los datos de los pacientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClinicalRecords();
  }, []);

  const handleAnsweredStatusChange = (answeredRecords) => {
    setAnsweredRecords(answeredRecords);
  };

  const handleDelete = (recordId) => {
    setClinicalRecords(clinicalRecords.filter((record) => record._id !== recordId));
  };

  const handleSubmitAnswer = (clinicalRecordNumber) => {
    onResponseSubmitted();
  };

  const isAnswered = (clinicalRecordNumber) => {
    return answeredRecords.some(record => record.clinicalRecordNumber === clinicalRecordNumber);
  };

  if (loading) return <div>Cargando fichas clínicas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Fichas Clínicas</h2>

      {clinicalRecords.length === 0 ? (
        <p>No hay fichas clínicas disponibles.</p>
      ) : (
        <ul>
          {clinicalRecords
            .filter(record => !isAnswered(record.clinicalRecordNumber))
            .map((record) => (
              <li key={record._id} className="mb-4">
                {/* Datos de la ficha clínica y paciente */}
                {patientData[record.patientRun] && (
                  <div className="mb-2">
                    {/* Cambié el orden para que "N° Ficha Clínica" esté arriba */}
                    <p><strong>N° Ficha Clínica:</strong> {record.clinicalRecordNumber}</p>
                    <p className="flex items-center space-x-4">
                      <span><strong>RUN:</strong> {record.patientRun}</span>
                      <span><strong>Nombre:</strong> {patientData[record.patientRun].fullName}</span>
                      <span><strong>Edad:</strong> {patientData[record.patientRun].age}</span>
                      <span><strong>Género:</strong> {patientData[record.patientRun].gender}</span>
                      <span><strong>Dirección:</strong> {patientData[record.patientRun].address}</span>
                      <span><strong>Email:</strong> {patientData[record.patientRun].email}</span>
                    </p>
                  </div>
                )}

                {/* Mostrar la fecha de creación arriba con los datos del paciente */}
                <p><strong>Fecha de Creación:</strong> {new Date(record.createdAt).toLocaleString()}</p>

                <p><strong>Descripción:</strong> {record.content}</p>

                {user.role === "profesor" && (
                  <DeleteClinicalRecord recordId={record._id} onDelete={handleDelete} />
                )}

                {user.role === "alumno" && (
                  <div>
                    <FindAnsweredClinicalRecordByEmail 
                      userEmail={user.email} 
                      onAnswered={handleAnsweredStatusChange} 
                    />
                    {!isAnswered(record.clinicalRecordNumber) && (
                      <CreateAnsweredClinicalRecords 
                        clinicalRecordNumber={record.clinicalRecordNumber}
                        onSubmit={handleSubmitAnswer} 
                      />
                    )}
                  </div>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
