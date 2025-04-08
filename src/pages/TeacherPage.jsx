// src/pages/TeacherPage.jsx
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
import Footer from "../components/Footer";

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-950 to-blue-900">
      {/* Header */}
      <Header />

      {/* Contenido principal con efecto glassmorphism */}
      <main className="flex-1 px-4 pt-20 max-w-4xl w-full mx-auto">
        <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg border border-white/40 p-6">
          {/* Botones de navegación */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
            <ToggleButton
              isVisible={showForm}
              onToggle={() => setShowForm(!showForm)}
              showText="Crear Nuevo Paciente"
              hideText="Cancelar Creación de Paciente"
            />
            <ToggleButton
              isVisible={showPatientList}
              onToggle={() => setShowPatientList(!showPatientList)}
              showText="Ver Lista de Pacientes"
              hideText="Ocultar Lista de Pacientes"
            />
            <ToggleButton
              isVisible={showClinicRecordForm}
              onToggle={() => setShowClinicRecordForm(!showClinicRecordForm)}
              showText="Crear Ficha Clínica"
              hideText="Cancelar Creación de Ficha"
            />
            <ToggleButton
              isVisible={showClinicalRecords}
              onToggle={() => setShowClinicalRecords(!showClinicalRecords)}
              showText="Ver Fichas Clínicas"
              hideText="Ocultar Fichas Clínicas"
            />
            <ToggleButton
              isVisible={showAnsweredRecords}
              onToggle={() => setShowAnsweredRecords(!showAnsweredRecords)}
              showText="Ver Respuestas de Fichas"
              hideText="Ocultar Respuestas"
            />
          </div>

          {/* Componentes condicionales */}
          <div className="space-y-6">
            {showForm && <CreatePatient onClose={() => setShowForm(false)} />}
            {showPatientList && <PatientList />}
            {showClinicRecordForm && (
              <CreateClinicalRecord onClose={() => setShowClinicRecordForm(false)} />
            )}
            {showClinicalRecords && <ClinicalRecordList />}
            {showAnsweredRecords && (
              <AnsweredClinicalRecordList onFeedbackSaved={handleCloseAnsweredRecords} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
