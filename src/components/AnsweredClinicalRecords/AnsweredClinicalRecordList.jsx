import { useState, useEffect, useContext } from "react";
import axios from "axios";
import TableComponent from "../TableComponent";
import ToggleButton from "../ToggleButton";
import Feedback from "./Feedback";
import { AuthContext } from "../Auth/AuthProvider";

export default function AnsweredClinicalRecordList({ onFeedbackSaved }) {
  const { user } = useContext(AuthContext);
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const userEmail = user?.email;
  const userRole = user?.role;

  useEffect(() => {
    const fetchAnsweredRecords = async () => {
      setLoading(true);
      try {
        const { data: records } = await axios.get("http://localhost:5000/api/answered-clinical-records");

        // Filtrado por rol
        const filteredRecords = records
          .filter((record) => {
            if (userRole === "alumno") return record.email === userEmail;
            if (userRole === "profesor") return record.email !== userEmail;
            return true; // admin u otro: ver todo
          })
          .filter((record) =>
            filter === "all"
              ? true
              : filter === "with-feedback"
              ? !!record.feedback
              : !record.feedback
          );

        setAnsweredRecords(filteredRecords);
      } catch (err) {
        setError("Error al cargar las respuestas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnsweredRecords();
  }, [userEmail, userRole, filter]);

  const handleFeedbackToggle = (record) => {
    setSelectedRecord(
      selectedRecord?.clinicalRecordNumber === record.clinicalRecordNumber ? null : record
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Respuestas de Fichas Clínicas</h2>

      <div className="mb-4">
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="with-feedback">Con Retroalimentación</option>
          <option value="without-feedback">Sin Retroalimentación</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando respuestas...</p>
      ) : answeredRecords.length === 0 ? (
        <p>No hay respuestas registradas.</p>
      ) : (
        <>
          <TableComponent
            columns={[
              { key: "clinicalRecordNumber", label: "N° Ficha Clínica" },
              { key: "email", label: "Alumno" },
              {
                key: "teacherEmail",
                label: "Profesor",
                render: (row) => row.teacherEmail || "N/A",
              },
              {
                key: "updatedAt",
                label: "Última Actualización",
                render: (row) => new Date(row.updatedAt).toLocaleString(),
              },
              // 👇 Mostrar acciones solo si no es admin
              ...(userRole !== "admin"
                ? [
                    {
                      key: "actions",
                      label: "Acciones",
                      render: (row) => (
                        <ToggleButton
                          isVisible={
                            selectedRecord?.clinicalRecordNumber ===
                            row.clinicalRecordNumber
                          }
                          onToggle={() => handleFeedbackToggle(row)}
                          showText="Detalle"
                          hideText="Cancelar"
                          className="bg-blue-500 text-white"
                        />
                      ),
                    },
                  ]
                : []),
            ]}
            data={answeredRecords}
          />

          {/* Mostrar feedback solo si no es admin */}
          {selectedRecord && userRole !== "admin" && (
            <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">
                Ficha Clínica #{selectedRecord.clinicalRecordNumber} de{" "}
                {selectedRecord.email}
              </h3>
              <Feedback
                recordId={selectedRecord._id}
                initialFeedback={selectedRecord.feedback}
                clinicalRecordNumber={selectedRecord.clinicalRecordNumber}
                answer={selectedRecord.answer}
                onSave={() => {
                  setSelectedRecord(null);
                  onFeedbackSaved?.();
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
