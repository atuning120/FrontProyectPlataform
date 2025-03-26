import { useState, useEffect } from "react";
import axios from "axios";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("https://backproyectplataform.onrender.com/api/patients");
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p>Cargando pacientes...</p>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Pacientes</h1>
      <table className="min-w-full table-auto">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
