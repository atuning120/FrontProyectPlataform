import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import DeleteClinicalRecord from "./DeleteClinicalRecord";
import CreateAnsweredClinicalRecords from "../AnsweredClinicalRecords/CreateAnsweredClinicalRecord";
import TableComponent from "../TableComponent";
import ToggleButton from "../ToggleButton";

export default function ClinicalRecordList({ onResponseSubmitted, setNotification, pedirConfirmacion }) {
  const { user } = useContext(AuthContext);
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedForDeletion, setSelectedForDeletion] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsResponse, answeredResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API}/clinical-records`),
        axios.get(`${import.meta.env.VITE_API}/answered-clinical-records/${user.email}`),
      ]);

      setClinicalRecords(recordsResponse.data);
      setAnsweredRecords(answeredResponse.data);
      setSelectedForDeletion([]); // Limpiar selección
    } catch (err) {
      setError("Error al obtener fichas clínicas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.email]);

  const handleDelete = (recordId) => {
    setClinicalRecords((prev) => prev.filter((record) => record._id !== recordId));
  };

  const toggleRecord = (record) => {
    setSelectedRecord((prev) => (prev?._id === record._id ? null : record));
    setPatientName(""); // Limpia el nombre al cambiar de ficha
  };

  const recordsToShow = clinicalRecords.filter(
    (record) => !answeredRecords.some((answered) => answered.clinicalRecordNumber === record.clinicalRecordNumber)
  );

  const handleSelectOne = (id) => {
    setSelectedForDeletion((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedForDeletion(recordsToShow.map((r) => r._id));
    } else {
      setSelectedForDeletion([]);
    }
  };

  const handleBulkDelete = () => {
    const message = `¿Estás seguro de que quieres eliminar ${selectedForDeletion.length} fichas seleccionadas?`;
    pedirConfirmacion?.(message, async () => {
      try {
        await axios.delete(`${import.meta.env.VITE_API}/clinical-records`, {
          data: { ids: selectedForDeletion },
        });
        setNotification({
          message: "Fichas eliminadas correctamente.",
          type: "success",
        });
        fetchData(); // Recarga los datos
      } catch (err) {
        console.error("Error al eliminar fichas:", err);
        setNotification({
          message: "Hubo un error al eliminar las fichas.",
          type: "error",
        });
      }
    });
  };

  if (loading) return <div>Cargando fichas clínicas...</div>;
  if (error) return <div>{error}</div>;

  const columns = [
    (user.role === "profesor" || user.role === "admin") && {
      key: "select",
      label: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={recordsToShow.length > 0 && selectedForDeletion.length === recordsToShow.length}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedForDeletion.includes(row._id)}
          onChange={() => handleSelectOne(row._id)}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
      ),
    },
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
  ].filter(Boolean);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Fichas Clínicas</h2>
        {selectedForDeletion.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
          >
            Eliminar ({selectedForDeletion.length}) seleccionadas
          </button>
        )}
      </div>

      {recordsToShow.length === 0 ? (
        <p>No hay fichas clínicas disponibles para responder.</p>
      ) : (
        <TableComponent columns={columns} data={recordsToShow} />
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