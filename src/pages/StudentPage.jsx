import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PatientList from "../components/Patients/PatientList";

export default function StudentPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPatientList, setShowPatientList] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "alumno") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "alumno") return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header />

      {/* Botón para mostrar la lista de pacientes */}
      <div className="max-w-md mx-auto mt-6">
        <button
          onClick={() => setShowPatientList(!showPatientList)}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {showPatientList ? "Ocultar Lista de Pacientes" : "Ver Lista de Pacientes"}
        </button>

        {/* Renderizar la lista de pacientes solo si el botón está activo */}
        {showPatientList && <PatientList />}
      </div>
    </div>
  );
}
