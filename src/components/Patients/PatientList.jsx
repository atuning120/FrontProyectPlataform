import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import DeletePatientButton from "./DeletePatientButton";
import TableComponent from "../TableComponent";

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
    setPatients((prevPatients) => prevPatients.filter((patient) => patient._id !== id));
  };

  if (loading) return <p>Cargando pacientes...</p>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Pacientes</h1>

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
          user.role === "profesor" && {
            key: "actions",
            label: "Acciones",
            render: (row) => <DeletePatientButton patientId={row._id} onDelete={handleDeletePatient} />,
          },
        ].filter(Boolean)}
        data={patients}
      />
    </div>
  );
}
