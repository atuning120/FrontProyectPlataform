import { useState } from "react";
import PatientList from "./Patients/PatientList"; // Asegúrate de que la ruta esté correcta según la ubicación de tu archivo PatientList.jsx

export default function AdminPanel() {
  const [showPatientList, setShowPatientList] = useState(false);

  const handleViewPatients = () => {
    setShowPatientList(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <button
        onClick={handleViewPatients}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-4"
      >
        Ver lista de pacientes
      </button>

      {showPatientList && <PatientList />}
    </div>
  );
}
