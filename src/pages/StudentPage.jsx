import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import ToggleButton from "../components/ToggleButton"; // Importamos el nuevo componente

export default function StudentPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showClinicalRecords, setShowClinicalRecords] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "alumno") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "alumno") return null;

  const handleToggleClinicalRecords = () => {
    setShowClinicalRecords(!showClinicalRecords);
  };

  const handleResponseSubmitted = () => {
    // Cerrar el botón de mostrar fichas clínicas cuando se envía una respuesta
    console.log("Respuesta enviada, ocultando fichas clínicas.");
    setShowClinicalRecords(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header />

      <div className="mt-6">
        <ToggleButton
          isVisible={showClinicalRecords}
          onToggle={handleToggleClinicalRecords}
          showText="Mostrar Fichas Clínicas"
          hideText="Ocultar Fichas Clínicas"
          className="bg-blue-500 text-white"
        />

        {showClinicalRecords && (
          <ClinicalRecordList onResponseSubmitted={handleResponseSubmitted} />
        )}
      </div>
    </div>
  );
}
