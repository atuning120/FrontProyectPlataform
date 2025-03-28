import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import DeletePatientButton from "./DeletePatientButton";

export default function PatientList() {
  const [patients, setPatients] = useState([]); // Estado para almacenar la lista de pacientes
  const [loading, setLoading] = useState(true); // Estado para controlar el estado de carga
  const { user } = useContext(AuthContext); // Obtener el usuario actual desde el contexto de autenticación

  // Cargar pacientes desde la API cuando el componente se monta
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patients");
        setPatients(response.data); // Almacenar los pacientes en el estado
      } catch (error) {
        console.error("Error fetching patients:", error); // Manejar errores al obtener los pacientes
      } finally {
        setLoading(false); // Finalizar el estado de carga
      }
    };

    fetchPatients(); // Ejecutar la función de carga de pacientes
  }, []); // Se ejecuta una sola vez cuando el componente se monta

  // Función para eliminar un paciente de la lista
  const handleDeletePatient = (id) => {
    setPatients(patients.filter(patient => patient._id !== id)); // Eliminar paciente con el id proporcionado
  };

  if (loading) return <p>Cargando pacientes...</p>; // Mostrar mensaje mientras se cargan los pacientes

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Pacientes</h1>
      <table className="min-w-full table-auto mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">RUN</th>
            <th className="px-4 py-2">Sexo</th>
            <th className="px-4 py-2">Edad</th>
            <th className="px-4 py-2">Previsión</th>
            <th className="px-4 py-2">Dirección</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Correo</th>
            {user.role === "profesor" && <th className="px-4 py-2">Acciones</th>} {/* Mostrar columna de acciones solo si el usuario es profesor */}
          </tr>
        </thead>
        <tbody>
          {/* Iterar sobre la lista de pacientes y mostrar sus datos */}
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td className="px-4 py-2">{patient.fullName}</td>
              <td className="px-4 py-2">{patient.run}</td>
              <td className="px-4 py-2">{patient.gender}</td>
              <td className="px-4 py-2">{patient.age}</td>
              <td className="px-4 py-2">{patient.insurance}</td>
              <td className="px-4 py-2">{patient.address}</td>
              <td className="px-4 py-2">{patient.mobileNumber}</td>
              <td className="px-4 py-2">{patient.email}</td>
              {user.role === "profesor" && (
                <td className="px-4 py-2">
                  <DeletePatientButton patientId={patient._id} onDelete={handleDeletePatient} /> {/* Mostrar botón de eliminar solo para profesores */}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
