// src/pages/StudentPage.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MenuExample from "../components/ExampleMenu";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import AnsweredClinicalRecordList from "../components/AnsweredClinicalRecords/AnsweredClinicalRecordList";
import ToggleButton from "../components/ToggleButton";
import ExampleMenu from "../components/ExampleMenu";

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
    <>
      <ExampleMenu/>
      <Header />

      <div className="pt-20 px-4 max-w-4xl mx-auto">
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
      </div>
    </>
  );
}
