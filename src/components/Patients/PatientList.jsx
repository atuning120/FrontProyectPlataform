import { useState, useEffect } from "react";
import axios from "axios";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch patients when the component is mounted
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patients");
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Realizar la solicitud DELETE al backend
      const response = await axios.delete(`http://localhost:5000/api/patients/${id}`);
      
      // Si la eliminación es exitosa, actualizamos la lista de pacientes
      setPatients(patients.filter(patient => patient._id !== id));

      alert(response.data.message); // Mensaje de éxito
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Hubo un error al eliminar el paciente.");
    }
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
            <th className="px-4 py-2">Acciones</th>
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
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(patient._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
