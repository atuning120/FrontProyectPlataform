import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import DeleteClinicalRecord from "./DeleteClinicalRecord";
import CreateAnsweredClinicalRecords from "../AnsweredClinicalRecords/CreateAnsweredClinicalRecord";
import TableComponent from "../TableComponent";
import ToggleButton from "../ToggleButton";

export default function ClinicalRecordList({ onResponseSubmitted }) {
  const { user } = useContext(AuthContext);
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
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
            {
              key: "updatedAt",
              label: "Fecha",
              render: (row) => new Date(row.updatedAt).toLocaleDateString(),
            },
            { key: "content", label: "Descripción" },
            // 👇 Solo agregar columna de acciones si NO es admin
            ...(user.role !== "admin"
              ? [
                  {
                    key: "actions",
                    label: "Acciones",
                    render: (row) => {
                      if (user.role === "profesor") {
                        return (
                          <DeleteClinicalRecord
                            recordId={row._id}
                            onDelete={handleDelete}
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
                ]
              : []),
          ]}
          data={recordsToShow}
        />
      )}

      {/* 👇 Mostrar formulario solo a alumnos */}
      {selectedRecord && user.role === "alumno" && (
        <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">
            Respondiendo Ficha Clínica #{selectedRecord.clinicalRecordNumber}
          </h3>
          <CreateAnsweredClinicalRecords
            clinicalRecordNumber={selectedRecord.clinicalRecordNumber}
            patientRun={selectedRecord.patientRun}
            onSubmit={onResponseSubmitted}
          />
        </div>
      )}
    </div>
  );
}
