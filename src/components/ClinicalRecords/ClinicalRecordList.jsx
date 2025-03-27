import { useEffect, useState } from "react";
import axios from "axios";

export default function ClinicalRecordList() {
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [patientData, setPatientData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClinicalRecords = async () => {
      try {
        // Obtener todas las fichas clínicas
        const response = await axios.get("http://localhost:5000/api/clinical-records");
        setClinicalRecords(response.data);

        // Obtener los datos de los pacientes para cada ficha clínica
        const patientDataMap = {}; // Para almacenar los datos de los pacientes por su RUN
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

  if (loading) return <div>Cargando fichas clínicas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Fichas Clínicas</h2>
      {clinicalRecords.length === 0 ? (
        <p>No hay fichas clínicas disponibles.</p>
      ) : (
        <ul>
          {clinicalRecords.map((record) => (
            <li key={record._id} className="mb-4">
              {/* Mostrar datos del paciente en una sola línea */}
              {patientData[record.patientRun] && (
                <div className="mb-2">
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
              
              {/* Mostrar la descripción de la ficha clínica debajo */}
              <p><strong>Descripción:</strong> {record.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
