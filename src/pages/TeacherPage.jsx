import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import CreatePatientForm from "../components/Patients/CreatePatientForm";
import PatientList from "../components/Patients/PatientList";

export default function TeacherPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showPatientList, setShowPatientList] = useState(false);

  // Redirigir si el usuario no es profesor
  useEffect(() => {
    if (!user || user.role !== "profesor") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "profesor") return null; // Evita renderizar antes de redirigir

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto">
        <UserProfile />

        {/* Contenedor independiente para los botones */}
        <div className="space-y-4 mb-6">
          {/* Botón para mostrar o cancelar formulario */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Crear Nuevo Paciente
            </button>
          ) : (
            <button
              onClick={() => setShowForm(false)}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Cancelar Creación de Paciente
            </button>
          )}

          {/* Botón para ver/ocultar lista de pacientes */}
          <button
            onClick={() => setShowPatientList(!showPatientList)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {showPatientList ? "Ocultar Lista de Pacientes" : "Ver Lista de Pacientes"}
          </button>
        </div>

        {/* Renderizar formulario solo si showForm es true */}
        {showForm && <CreatePatientForm onClose={() => setShowForm(false)} />}

        {/* Renderizar lista de pacientes solo si showPatientList es true */}
        {showPatientList && <PatientList />}
      </div>
    </div>
  );
}
