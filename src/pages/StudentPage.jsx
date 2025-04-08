// src/pages/StudentPage.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import AnsweredClinicalRecordList from "../components/AnsweredClinicalRecords/AnsweredClinicalRecordList";
import ToggleButton from "../components/ToggleButton";
import HeaderStudent from "../components/HeaderStudent";
import Footer from "../components/Footer";

export default function StudentPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showClinicalRecords, setShowClinicalRecords] = useState(false);
  const [showAnsweredRecords, setShowAnsweredRecords] = useState(false);

  // Redirección si el usuario no es un alumno
  useEffect(() => {
    if (!user || user.role !== "alumno") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "alumno") return null;

  const handleToggleClinicalRecords = () =>
    setShowClinicalRecords(!showClinicalRecords);

  const handleToggleAnsweredRecords = () =>
    setShowAnsweredRecords(!showAnsweredRecords);

  const handleResponseSubmitted = () => {
    console.log("Respuesta enviada, ocultando fichas clínicas.");
    setShowClinicalRecords(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <HeaderStudent />

      {/* Contenido principal que crece según el contenido */}
      <main className="flex-1 pt-20 px-4 max-w-4xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <ToggleButton
            isVisible={showClinicalRecords}
            onToggle={handleToggleClinicalRecords}
            showText="Ver Fichas Clínicas"
            hideText="Ocultar Fichas Clínicas"
          />
          <ToggleButton
            isVisible={showAnsweredRecords}
            onToggle={handleToggleAnsweredRecords}
            showText="Ver Fichas Enviadas"
            hideText="Ocultar Fichas Enviadas"
          />
        </div>

        <div className="space-y-6">
          {showClinicalRecords && (
            <ClinicalRecordList onResponseSubmitted={handleResponseSubmitted} />
          )}
          {showAnsweredRecords && <AnsweredClinicalRecordList />}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );

}
