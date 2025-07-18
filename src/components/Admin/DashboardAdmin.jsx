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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [confirm, setConfirm] = useState({
    open: false,
    message: "",
    onConfirm: () => { },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
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
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


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

      <h1 className="text-2xl font-bold text-white mb-6"> Panel de administración</h1>
      {loading ? (
        <p className="text-white">Cargando estadísticas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
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
      )}

    </div>
  );
}
