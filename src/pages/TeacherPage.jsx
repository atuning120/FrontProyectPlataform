import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/Header";
import CreatePatientForm from "../components/Patients/CreatePatientForm";
import PatientList from "../components/Patients/PatientList";
import CreateClinicalRecord from "../components/ClinicalRecords/CreateClinicalRecord"; 
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList"; // Importamos el componente de lista de fichas clínicas
import ToggleButton from "../components/ToggleButton"; // Importamos el nuevo componente de botón

export default function TeacherPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showPatientList, setShowPatientList] = useState(false);
  const [showClinicRecordForm, setShowClinicRecordForm] = useState(false);
  const [showClinicalRecords, setShowClinicalRecords] = useState(false); // Nuevo estado para fichas clínicas

  useEffect(() => {
    if (!user || user.role !== "profesor") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "profesor") return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto">
        <UserProfile />

        <div className="space-y-4 mb-6">
          {/* Botón para mostrar o cancelar formulario de paciente */}
          <ToggleButton
            isVisible={showForm}
            onToggle={() => setShowForm(!showForm)}
            showText="Crear Nuevo Paciente"
            hideText="Cancelar Creación de Paciente"
            className={`bg-${showForm ? "red" : "blue"}-500 text-white`}
          />

          {/* Botón para ver/ocultar lista de pacientes */}
          <ToggleButton
            isVisible={showPatientList}
            onToggle={() => setShowPatientList(!showPatientList)}
            showText="Ver Lista de Pacientes"
            hideText="Ocultar Lista de Pacientes"
            className="bg-blue-500 text-white"
          />

          {/* Botón para mostrar u ocultar formulario de crear ficha clínica */}
          <ToggleButton
            isVisible={showClinicRecordForm}
            onToggle={() => setShowClinicRecordForm(!showClinicRecordForm)}
            showText="Crear Ficha Clínica"
            hideText="Cancelar Creación de Ficha"
            className={`bg-${showClinicRecordForm ? "red" : "green"}-500 text-white`}
          />

          {/* Botón para mostrar u ocultar la lista de fichas clínicas */}
          <ToggleButton
            isVisible={showClinicalRecords}
            onToggle={() => setShowClinicalRecords(!showClinicalRecords)}
            showText="Ver Fichas Clínicas"
            hideText="Ocultar Fichas Clínicas"
            className="bg-blue-500 text-white"
          />
        </div>

        {showForm && <CreatePatientForm onClose={() => setShowForm(false)} />}
        {showPatientList && <PatientList />}
        {showClinicRecordForm && <CreateClinicalRecord onClose={() => setShowClinicRecordForm(false)} />}
        
        {/* Mostrar la lista de fichas clínicas si está activado */}
        {showClinicalRecords && <ClinicalRecordList />}
      </div>
    </div>
  );
}
