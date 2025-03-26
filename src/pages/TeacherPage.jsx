import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import CreatePatientForm from "../components/Patients/CreatePatientForm"; // Importamos el formulario
import PatientList from "../components/Patients/PatientList"; // Importamos el componente para la lista de pacientes

export default function TeacherPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario
  const [showPatientList, setShowPatientList] = useState(false); // Estado para mostrar/ocultar la lista de pacientes

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

        {/* Botón para mostrar formulario */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-6"
          >
            Crear Nuevo Paciente
          </button>
        )}

        {/* Renderizar formulario solo si showForm es true */}
        {showForm && <CreatePatientForm onClose={() => setShowForm(false)} />}

        {/* Botón para ver la lista de pacientes */}
        {!showPatientList && (
          <button
            onClick={() => setShowPatientList(true)}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition mt-6"
          >
            Ver Lista de Pacientes
          </button>
        )}

        {/* Renderizar lista de pacientes solo si showPatientList es true */}
        {showPatientList && <PatientList />}
      </div>
    </div>
  );
}
