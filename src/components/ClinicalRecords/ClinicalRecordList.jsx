import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import DeleteClinicalRecord from "./DeleteClinicalRecord";
import CreateAnsweredClinicalRecords from "../AnsweredClinicalRecords/CreateAnsweredClinicalRecord";
import TableComponent from "../TableComponent";
import ToggleButton from "../ToggleButton";

export default function ClinicalRecordList({ onResponseSubmitted, setNotification , pedirConfirmacion }) {
  const { user } = useContext(AuthContext);
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [patientName, setPatientName] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsResponse, answeredResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API}/clinical-records`),
          axios.get(`${import.meta.env.VITE_API}/answered-clinical-records/${user.email}`)
        ]);

        setClinicalRecords(recordsResponse.data);
        setAnsweredRecords(answeredResponse.data);
      } catch (err) {
        setError("Error al obtener fichas clínicas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.email]);

  const handleDelete = (recordId) => {
    setClinicalRecords(prev => prev.filter(record => record._id !== recordId));
  };

  const toggleRecord = (record) => {
    setSelectedRecord(prev => (prev?._id === record._id ? null : record));
    setPatientName(""); // Limpia el nombre al cambiar de ficha
  };

  if (loading) return <div>Cargando fichas clínicas...</div>;
  if (error) return <div>{error}</div>;

  const recordsToShow = clinicalRecords.filter(
    record => !answeredRecords.some(answered => answered.clinicalRecordNumber === record.clinicalRecordNumber)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4"> Clínicas</h2>

      {recordsToShow.length === 0 ? (
        <p>No hay fichas clínicas disponibles para responder.</p>
      ) : (
        <TableComponent
          columns={[
            { key: "clinicalRecordNumber", label: "N° Ficha Clínica" },
            { key: "patientRun", label: "RUN" },
            {
              key: "updatedAt",
              label: "Fecha",
              render: (row) => new Date(row.updatedAt).toLocaleDateString(),
            },
            { key: "content", label: "Descripción" },
            {
              key: "actions",
              label: "Acciones",
              render: (row) => {
                if (user.role === "profesor" || user.role === "admin") {
                  return (
                    <DeleteClinicalRecord
                      recordId={row._id}
                      onDelete={handleDelete}
                      setNotification={setNotification}
                      pedirConfirmacion={pedirConfirmacion}
                    />
                  );
                }

                if (user.role === "alumno") {
                  return (
                    <ToggleButton
                      isVisible={selectedRecord?._id === row._id}
                      onToggle={() => toggleRecord(row)}
                      showText="Ingresar"
                      hideText="Cancelar"
                      className="p-2 bg-blue-500 text-white rounded-md"
                    />
                  );
                }

                return null;
              },
            },
          ]}
          data={recordsToShow}
        />
      )}

      {selectedRecord && user.role === "alumno" && (
        <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">
            Atención Clínica 
            {patientName && ` - ${patientName}`}
          </h3>
          <CreateAnsweredClinicalRecords
            clinicalRecordNumber={selectedRecord.clinicalRecordNumber}
            patientRun={selectedRecord.patientRun}
            onSubmit={onResponseSubmitted}
            onPatientLoaded={setPatientName} 
            setNotification={setNotification}
          />
        </div>
      )}
    </div>
  );
}
