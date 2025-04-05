import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import AnsweredClinicalRecordList from "../components/AnsweredClinicalRecords/AnsweredClinicalRecordList"; 
import ToggleButton from "../components/ToggleButton"; 

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

  // Alternar la visibilidad de las fichas clínicas
  const handleToggleClinicalRecords = () => setShowClinicalRecords(!showClinicalRecords);

  // Alternar la visibilidad de las respuestas enviadas
  const handleToggleAnsweredRecords = () => setShowAnsweredRecords(!showAnsweredRecords);

  // Ocultar las fichas clínicas cuando se envía una respuesta
  const handleResponseSubmitted = () => {
    console.log("Respuesta enviada, ocultando fichas clínicas.");
    setShowClinicalRecords(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header />

      {/* Barra fija con botones para alternar las secciones */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10">
        <ToggleButton
          isVisible={showClinicalRecords}
          onToggle={handleToggleClinicalRecords}
          showText="Ver Fichas Clínicas"
          hideText="Ocultar Fichas Clínicas"
          className="bg-blue-500 text-white w-full"
        />

        <ToggleButton
          isVisible={showAnsweredRecords}
          onToggle={handleToggleAnsweredRecords}
          showText="Ver Fichas Enviadas"
          hideText="Ocultar Fichas Enviadas"
          className="bg-green-500 text-white mt-4 w-full"
        />
      </div>

      {/* Margen superior para evitar solapamiento con la barra fija */}
      <div className="pt-24">
        {showClinicalRecords && <ClinicalRecordList onResponseSubmitted={handleResponseSubmitted} />}
        {showAnsweredRecords && <AnsweredClinicalRecordList />}
      </div>
    </div>
  );
}
