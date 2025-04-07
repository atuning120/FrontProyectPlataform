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
    <div>
      <Header />

      {/* Barra fija con botones para alternar las secciones */}
      <div className="">
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
          className=""
        />
      </div>

      {/* Margen superior para evitar solapamiento con la barra fija */}
      <div className="">
        {showClinicalRecords && <ClinicalRecordList onResponseSubmitted={handleResponseSubmitted} />}
        {showAnsweredRecords && <AnsweredClinicalRecordList />}
      </div>
    </div>
  );
}
