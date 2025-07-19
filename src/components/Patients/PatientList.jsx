import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import DeletePatient from "./DeletePatient";
import TableComponent from "../TableComponent";
import PaginationComponent from "../Pagination/PaginationComponent";

export default function PatientList({ 
  setNotification, 
  pedirConfirmacion, 
  usePagination = false, 
  itemsPerPage = 10 
}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API}/patients`);
      setPatients(response.data);
      setSelectedPatients([]); // Limpiar selección al recargar
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
      const message = error.response?.data?.message || "Error de conexión con el servidor.";
      setNotification?.({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeletePatient = (id) => {
    setPatients((prev) => prev.filter((patient) => patient._id !== id));
  };

  const handleSelectOne = (id) => {
    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPatients(patients.map((p) => p._id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleBulkDelete = () => {
    const message = `¿Estás seguro de que quieres eliminar ${selectedPatients.length} pacientes seleccionados?`;
    pedirConfirmacion?.(message, async () => {
      try {
        await axios.delete(`${import.meta.env.VITE_API}/patients`, {
          data: { ids: selectedPatients },
        });
        setNotification({
          message: "Pacientes eliminados correctamente.",
          type: "success",
        });
        fetchPatients();
      } catch (err) {
        console.error("Error al eliminar pacientes:", err);
        // Capturar el mensaje específico del servidor
        const errorMessage = err.response?.data?.message || "Hubo un error al eliminar los pacientes.";
        setNotification({
          message: errorMessage,
          type: "error",
        });
      }
    });
  };

  if (loading) return <p>Cargando pacientes...</p>;

  // Agregar esta condición antes del return principal
  if (!loading && patients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Lista de Pacientes</h2>
        <p className="text-gray-600">No hay pacientes disponibles.</p>
      </div>
    );
  }

  const columns = [
    // Columna para Checkboxes
    (user.role === "profesor" || user.role === "admin") && {
      key: "select",
      label: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={patients.length > 0 && selectedPatients.length === patients.length}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedPatients.includes(row._id)}
          onChange={() => handleSelectOne(row._id)}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
      ),
    },
    { key: "fullName", label: "Nombre" },
    { key: "run", label: "RUN" },
    { key: "gender", label: "Sexo" },
    { key: "age", label: "Edad" },
    { key: "insurance", label: "Previsión" },
    { key: "address", label: "Dirección" },
    { key: "mobileNumber", label: "Teléfono" },
    { key: "email", label: "Correo" },
    (user.role === "profesor" || user.role === "admin") && {
      key: "actions",
      label: "Acciones",
      render: (row) => (
        <DeletePatient
          patientId={row._id}
          onDelete={handleDeletePatient}
          setNotification={setNotification}
          pedirConfirmacion={pedirConfirmacion}
        />
      ),
    },
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Lista de Pacientes</h2>
        {/* Botón de eliminar seleccionados */}
        {selectedPatients.length > 0 && (user.role === "profesor" || user.role === "admin") && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Eliminar seleccionados ({selectedPatients.length})
          </button>
        )}
      </div>
      
      {/* Resto del componente... */}
      {usePagination ? (
        <PaginationComponent
          data={patients}
          itemsPerPage={itemsPerPage}
          renderTable={(paginatedData) => (
            <TableComponent 
              columns={columns} 
              data={paginatedData} 
            />
          )}
        />
      ) : (
        <TableComponent columns={columns} data={patients} />
      )}
    </div>
  );
}