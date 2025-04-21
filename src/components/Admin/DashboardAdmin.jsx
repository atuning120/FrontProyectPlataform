import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    patients: 0,
    clinicalRecords: 0,
    answeredRecords: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
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
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">📊 Panel de administración</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
    </div>
  );
}
