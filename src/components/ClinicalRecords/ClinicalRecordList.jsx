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
        const [recordsResponse, answeredResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/clinical-records"),
          axios.get(`http://localhost:5000/api/answered-clinical-records/${user.email}`)
        ]);

        setClinicalRecords(recordsResponse.data);
        setAnsweredRecords(answeredResponse.data);

        const patientRuns = [...new Set(recordsResponse.data.map(record => record.patientRun))];

        const patientRequests = patientRuns.map(run =>
          axios.get(`http://localhost:5000/api/patients/${run}`).catch(() => null)
        );

        const patientResponses = await Promise.allSettled(patientRequests);

        const patientsData = {};
        patientResponses.forEach((response, index) => {
          if (response.status === "fulfilled" && response.value) {
            patientsData[patientRuns[index]] = response.value.data;
          }
        });

        setPatientData(patientsData);
      } catch (err) {
        setError("Error al obtener fichas clínicas o datos de pacientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.email]);

  const handleDelete = (recordId) => {
    setClinicalRecords(prev => prev.filter(record => record._id !== recordId));
  };

  if (loading) return <div>Cargando fichas clínicas...</div>;
  if (error) return <div>{error}</div>;

  const recordsToShow = clinicalRecords.filter(
    record => !answeredRecords.some(answered => answered.clinicalRecordNumber === record.clinicalRecordNumber)
  );

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
