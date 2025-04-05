import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CreatePatient from "../components/Patients/CreatePatient";
import PatientList from "../components/Patients/PatientList";
import CreateClinicalRecord from "../components/ClinicalRecords/CreateClinicalRecord";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import ToggleButton from "../components/ToggleButton";
import AnsweredClinicalRecordList from "../components/AnsweredClinicalRecords/AnsweredClinicalRecordList";

export default function TeacherPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [showPatientList, setShowPatientList] = useState(false);
  const [showClinicRecordForm, setShowClinicRecordForm] = useState(false);
  const [showClinicalRecords, setShowClinicalRecords] = useState(false);
  const [showAnsweredRecords, setShowAnsweredRecords] = useState(false);

  // Redirección si el usuario no es profesor
  useEffect(() => {
    if (!user || user.role !== "profesor") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "profesor") return null;

  // Cerrar la lista de respuestas cuando se guarda la retroalimentación
  const handleCloseAnsweredRecords = () => {
    setShowAnsweredRecords(false);
    alert("Retroalimentación guardada con éxito.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header />

      {/* Barra fija con los botones de navegación */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10">
        <ToggleButton
          isVisible={showForm}
          onToggle={() => setShowForm(!showForm)}
          showText="Crear Nuevo Paciente"
          hideText="Cancelar Creación de Paciente"
          className="bg-blue-500 text-white w-full"
        />

        <ToggleButton
          isVisible={showPatientList}
          onToggle={() => setShowPatientList(!showPatientList)}
          showText="Ver Lista de Pacientes"
          hideText="Ocultar Lista de Pacientes"
          className="bg-blue-500 text-white mt-4 w-full"
        />

        <ToggleButton
          isVisible={showClinicRecordForm}
          onToggle={() => setShowClinicRecordForm(!showClinicRecordForm)}
          showText="Crear Ficha Clínica"
          hideText="Cancelar Creación de Ficha"
          className="bg-green-500 text-white mt-4 w-full"
        />

        <ToggleButton
          isVisible={showClinicalRecords}
          onToggle={() => setShowClinicalRecords(!showClinicalRecords)}
          showText="Ver Fichas Clínicas"
          hideText="Ocultar Fichas Clínicas"
          className="bg-blue-500 text-white mt-4 w-full"
        />

        <ToggleButton
          isVisible={showAnsweredRecords}
          onToggle={() => setShowAnsweredRecords(!showAnsweredRecords)}
          showText="Ver Respuestas de Fichas"
          hideText="Ocultar Respuestas"
          className="bg-green-500 text-white mt-4 w-full"
        />
      </div>

      {/* Margen superior para evitar solapamiento con la barra fija */}
      <div className="pt-32">
        {showForm && <CreatePatient onClose={() => setShowForm(false)} />}
        {showPatientList && <PatientList />}
        {showClinicRecordForm && <CreateClinicalRecord onClose={() => setShowClinicRecordForm(false)} />}
        {showClinicalRecords && <ClinicalRecordList />}
        {showAnsweredRecords && <AnsweredClinicalRecordList onFeedbackSaved={handleCloseAnsweredRecords} />}
      </div>
    </div>
  );
}
