import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ClinicalRecordList from "../components/ClinicalRecords/ClinicalRecordList";
import AnsweredClinicalRecordList from "../components/AnsweredClinicalRecords/AnsweredClinicalRecordList"; // Importamos el nuevo componente
import ToggleButton from "../components/ToggleButton"; // Importamos el nuevo componente

export default function StudentPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showClinicalRecords, setShowClinicalRecords] = useState(false);
  const [showAnsweredRecords, setShowAnsweredRecords] = useState(false); // Nuevo estado para controlar la visibilidad de las respuestas

  useEffect(() => {
    if (!user || user.role !== "alumno") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "alumno") return null;

  const handleToggleClinicalRecords = () => {
    setShowClinicalRecords(!showClinicalRecords);
  };

  const handleToggleAnsweredRecords = () => {
    setShowAnsweredRecords(!showAnsweredRecords); // Alterna la visibilidad de las respuestas enviadas
  };

  const handleResponseSubmitted = () => {
    // Cerrar el botón de mostrar fichas clínicas cuando se envía una respuesta
    console.log("Respuesta enviada, ocultando fichas clínicas.");
    setShowClinicalRecords(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header />

      {/* Sección fija con los botones para mostrar/ocultar las fichas clínicas y respuestas enviadas */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-10">
        <ToggleButton
          isVisible={showClinicalRecords}
          onToggle={handleToggleClinicalRecords}
          showText="Mostrar Fichas Clínicas"
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

      {/* Espacio para evitar que el contenido debajo de la barra fija se solape */}
      <div className="pt-24">
        {/* Mostrar las fichas clínicas cuando el estado es true */}
        {showClinicalRecords && (
          <ClinicalRecordList onResponseSubmitted={handleResponseSubmitted} />
        )}

        {/* Mostrar las respuestas enviadas cuando el estado es true */}
        {showAnsweredRecords && <AnsweredClinicalRecordList />}
      </div>
    </div>
  );
}
