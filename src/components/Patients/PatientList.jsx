import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import DeletePatient from "./DeletePatient";
import TableComponent from "../TableComponent";

export default function PatientList({setNotification}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/patients`);
        setPatients(response.data);
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
        
        if (error.response?.data?.message) {
          alert(error.response.data.message); //  Usa el mensaje del backend si existe
        } else {
          alert("Error de conexión con el servidor."); //  Si el backend está caído
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchPatients();
  }, []);  

  const handleDeletePatient = (id) => {
    setPatients((prev) => prev.filter((patient) => patient._id !== id));
  };

  if (loading) return <p>Cargando pacientes...</p>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Lista de Pacientes</h2>

      <TableComponent
        columns={[
          { key: "fullName", label: "Nombre" },
          { key: "run", label: "RUN" },
          { key: "gender", label: "Sexo" },
          { key: "age", label: "Edad" },
          { key: "insurance", label: "Previsión" },
          { key: "address", label: "Dirección" },
          { key: "mobileNumber", label: "Teléfono" },
          { key: "email", label: "Correo" },
          (user.role === "profesor" || user.role === "admin") && {
            key: "actions",
            label: "Acciones",
            render: (row) => (
              <DeletePatient patientId={row._id} onDelete={handleDeletePatient} setNotification={setNotification}/>
            ),
          },
        ].filter(Boolean)}
        data={patients}
      />
    </div>
  );
}
