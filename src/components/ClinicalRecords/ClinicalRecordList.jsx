import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import DeleteClinicalRecord from "./DeleteClinicalRecord";
import CreateAnsweredClinicalRecords from "../AnsweredClinicalRecords/CreateAnsweredClinicalRecord";
import TableComponent from "../TableComponent";

export default function ClinicalRecordList({ onResponseSubmitted }) {
  const { user } = useContext(AuthContext);
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [patientData, setPatientData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener fichas clínicas
        const recordsResponse = await axios.get("http://localhost:5000/api/clinical-records");
        setClinicalRecords(recordsResponse.data);

        // Obtener respuestas del usuario actual (alumno o profesor)
        const answeredResponse = await axios.get(`http://localhost:5000/api/answered-clinical-records/${user.email}`);
        setAnsweredRecords(answeredResponse.data);

        // Obtener datos de pacientes
        const patientRuns = [...new Set(recordsResponse.data.map(record => record.patientRun))];
        const patientsData = {};
        await Promise.all(
          patientRuns.map(async (run) => {
            const patientResponse = await axios.get(`http://localhost:5000/api/patients/${run}`);
            patientsData[run] = patientResponse.data;
          })
        );
        setPatientData(patientsData);
      } catch (err) {
        setError("No se pudieron obtener las fichas clínicas o los datos de los pacientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.email]);

  // Filtrar fichas que el usuario aún no ha respondido
  const recordsToShow = clinicalRecords.filter(
    record => !answeredRecords.some(answered => answered.clinicalRecordNumber === record.clinicalRecordNumber)
  );

  const handleDelete = (recordId) => {
    setClinicalRecords(prevRecords => prevRecords.filter(record => record._id !== recordId));
  };

  if (loading) return <div>Cargando fichas clínicas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Fichas Clínicas</h2>

      {recordsToShow.length === 0 ? (
        <p>No hay fichas clínicas disponibles para responder.</p>
      ) : (
        <TableComponent
          columns={[
            { key: "clinicalRecordNumber", label: "N° Ficha Clínica" },
            { key: "patientRun", label: "RUN" },
            { key: "fullName", label: "Nombre", render: (row) => patientData[row.patientRun]?.fullName || "Desconocido" },
            { key: "age", label: "Edad", render: (row) => patientData[row.patientRun]?.age || "N/A" },
            { key: "gender", label: "Género", render: (row) => patientData[row.patientRun]?.gender || "N/A" },
            { key: "address", label: "Dirección", render: (row) => patientData[row.patientRun]?.address || "N/A" },
            { key: "email", label: "Email", render: (row) => patientData[row.patientRun]?.email || "N/A" },
            { key: "createdAt", label: "Fecha de Creación", render: (row) => new Date(row.createdAt).toLocaleString() },
            { key: "content", label: "Descripción" },
            {
              key: "actions",
              label: "Acciones",
              render: (row) =>
                user.role === "profesor" ? (
                  <DeleteClinicalRecord recordId={row._id} onDelete={handleDelete} />
                ) : (
                  <CreateAnsweredClinicalRecords clinicalRecordNumber={row.clinicalRecordNumber} onSubmit={onResponseSubmitted} />
                ),
            },
          ]}
          data={recordsToShow}
        />
      )}
    </div>
  );
}
