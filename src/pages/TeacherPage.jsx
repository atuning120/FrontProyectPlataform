import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/Header";
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

  useEffect(() => {
    if (!user || user.role !== "profesor") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "profesor") return null;

  const handleCloseAnsweredRecords = () => {
    setShowAnsweredRecords(false); 
    alert("Retroalimentación guardada con éxito.");
  };

  const handleCloseClinicRecordForm = () => {
    setShowClinicRecordForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto">
        <UserProfile />

        <div className="space-y-4 mb-6">
          <ToggleButton
            isVisible={showForm}
            onToggle={() => setShowForm(!showForm)}
            showText="Crear Nuevo Paciente"
            hideText="Cancelar Creación de Paciente"
            className={`bg-${showForm ? "red" : "blue"}-500 text-white`}
          />

          <ToggleButton
            isVisible={showPatientList}
            onToggle={() => setShowPatientList(!showPatientList)}
            showText="Ver Lista de Pacientes"
            hideText="Ocultar Lista de Pacientes"
            className="bg-blue-500 text-white"
          />

          <ToggleButton
            isVisible={showClinicRecordForm}
            onToggle={() => setShowClinicRecordForm(!showClinicRecordForm)}
            showText="Crear Ficha Clínica"
            hideText="Cancelar Creación de Ficha"
            className={`bg-${showClinicRecordForm ? "red" : "green"}-500 text-white`}
          />

          <ToggleButton
            isVisible={showClinicalRecords}
            onToggle={() => setShowClinicalRecords(!showClinicalRecords)}
            showText="Ver Fichas Clínicas"
            hideText="Ocultar Fichas Clínicas"
            className="bg-blue-500 text-white"
          />

          <ToggleButton
            isVisible={showAnsweredRecords}
            onToggle={() => setShowAnsweredRecords(!showAnsweredRecords)}
            showText="Ver Respuestas de Fichas"
            hideText="Ocultar Respuestas"
            className="bg-blue-500 text-white"
          />
        </div>

        {showForm && <CreatePatient onClose={() => setShowForm(false)} />}
        {showPatientList && <PatientList />}
        {showClinicRecordForm && <CreateClinicalRecord onClose={handleCloseClinicRecordForm} />}
        {showClinicalRecords && <ClinicalRecordList />}
        {showAnsweredRecords && (
          <AnsweredClinicalRecordList onFeedbackSaved={handleCloseAnsweredRecords} />
        )}
      </div>
    </div>
  );
}
