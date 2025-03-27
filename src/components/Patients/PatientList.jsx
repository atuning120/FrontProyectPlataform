import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import DeletePatientButton from "./DeletePatientButton";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleDeletePatient = (id) => {
    setPatients(patients.filter(patient => patient._id !== id));
  };

  if (loading) return <p>Cargando pacientes...</p>;

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
            {user.role === "profesor" && <th className="px-4 py-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
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
                  <DeletePatientButton patientId={patient._id} onDelete={handleDeletePatient} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
