import { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../Notification";
import ConfirmDialog from "../ConfirmDialog";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    patients: 0,
    clinicalRecords: 0,
    answeredRecords: 0,
  });
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [confirm, setConfirm] = useState({
    open: false,
    message: "",
    onConfirm: () => { },
  });
  const [selectedRecords, setSelectedRecords] = useState([]);

  const fetchStatsAndRecords = async () => {
    try {
      const [patients, clinicals, answered] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API}/patients`),
        axios.get(`${import.meta.env.VITE_API}/clinical-records`),
        axios.get(`${import.meta.env.VITE_API}/answered-clinical-records`),
      ]);

      setStats({
        patients: patients.data.length,
        clinicalRecords: clinicals.data.length,
        answeredRecords: answered.data.length,
      });

      setAnsweredRecords(answered.data);
      setSelectedRecords([]); // Limpiar selección al recargar
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setError("No se pudieron cargar las estadísticas.");
    } finally {
      setLoading(false);
    }
  };
  const pedirConfirmacion = (message, onConfirm) => {
    setConfirm({
      open: true,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirm((c) => ({ ...c, open: false }));
      },
    });
  };

  useEffect(() => {
    fetchStatsAndRecords();
  }, []);

  const handleDelete = (ids) => {
    const message = Array.isArray(ids)
      ? `¿Estás seguro de que quieres eliminar ${ids.length} respuestas seleccionadas?`
      : "¿Estás seguro de que quieres eliminar esta respuesta?";

    pedirConfirmacion(message, async () => {
      try {
        const params = Array.isArray(ids) ? { ids } : {};
        const url = Array.isArray(ids)
          ? `${import.meta.env.VITE_API}/answered-clinical-records`
          : `${import.meta.env.VITE_API}/answered-clinical-records/${ids}`;

        await axios.delete(url, { data: params });

        setNotification({
          message: "Respuesta(s) eliminada(s) correctamente.",
          type: "success",
        });
        fetchStatsAndRecords(); // Recarga los datos y limpia la selección
      } catch (err) {
        console.error("Error al eliminar:", err);
        setNotification({
          message: "Hubo un error al eliminar la(s) respuesta(s).",
          type: "error",
        });
      }
    });
  };

  const handleSelectOne = (id) => {
    setSelectedRecords((prev) =>
      prev.includes(id) ? prev.filter((recordId) => recordId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRecords(answeredRecords.map((r) => r._id));
    } else {
      setSelectedRecords([]);
    }
  };

  return (
    <div>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, message: "" })}
      />
      <ConfirmDialog
        open={confirm.open}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />

      <h1 className="text-2xl font-bold text-white mb-6">📊 Panel de administración</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <li className="bg-white/50 p-4 rounded-lg shadow border border-white/40">
          <h2 className="text-lg font-semibold text-blue-900">Pacientes registrados</h2>
          <p className="text-3xl font-bold text-blue-950">{stats.patients}</p>
        </li>
        <li className="bg-white/50 p-4 rounded-lg shadow border border-white/40">
          <h2 className="text-lg font-semibold text-blue-900">Fichas clínicas creadas</h2>
          <p className="text-3xl font-bold text-blue-950">{stats.clinicalRecords}</p>
        </li>
        <li className="bg-white/50 p-4 rounded-lg shadow border border-white/40 col-span-full sm:col-span-1">
          <h2 className="text-lg font-semibold text-blue-900">Fichas respondidas</h2>
          <p className="text-3xl font-bold text-blue-950">{stats.answeredRecords}</p>
        </li>
      </ul>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">📄 Fichas Respondidas</h2>
        {selectedRecords.length > 0 && (
          <button
            onClick={() => handleDelete(selectedRecords)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
          >
            Eliminar ({selectedRecords.length}) seleccionadas
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-white">Cargando respuestas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : answeredRecords.length === 0 ? (
        <p className="text-white">No hay fichas respondidas.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left text-sm">
              <th className="p-2 w-4">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    answeredRecords.length > 0 &&
                    selectedRecords.length === answeredRecords.length
                  }
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
              </th>
              <th className="p-2">N° Ficha</th>
              <th className="p-2">Alumno</th>
              <th className="p-2">Hora de Envío</th>
              <th className="p-2">Tiempo Invertido</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {answeredRecords.map((record) => (
              <tr key={record._id} className="border-b border-gray-300 text-sm">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedRecords.includes(record._id)}
                    onChange={() => handleSelectOne(record._id)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                </td>
                <td className="p-2">{record.clinicalRecordNumber}</td>
                <td className="p-2">{record.email}</td>
                <td className="p-2">{new Date(record.createdAt).toLocaleString()}</td>
                <td className="p-2">{record.responseTime || "N/A"}</td>
                <td className="p-2">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                    onClick={() => handleDelete(record._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
