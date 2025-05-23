import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    patients: 0,
    clinicalRecords: 0,
    answeredRecords: 0,
  });
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatsAndRecords = async () => {
    try {
      const [patients, clinicals, answered] = await Promise.all([
        axios.get("http://localhost:5000/api/patients"),
        axios.get("http://localhost:5000/api/clinical-records"),
        axios.get("http://localhost:5000/api/answered-clinical-records"),
      ]);

      setStats({
        patients: patients.data.length,
        clinicalRecords: clinicals.data.length,
        answeredRecords: answered.data.length,
      });

      setAnsweredRecords(answered.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setError("No se pudieron cargar las estadísticas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndRecords();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta respuesta?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/answered-clinical-records/${id}`);
      alert("Respuesta eliminada correctamente.");
      fetchStatsAndRecords(); // actualizar estadísticas y lista
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar la respuesta.");
    }
  };

  return (
    <div>
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

      <h2 className="text-xl font-semibold text-white mb-4">📄 Fichas Respondidas</h2>

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
