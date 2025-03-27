import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Auth/AuthProvider";
import ToggleButton from "../ToggleButton";  // Importamos ToggleButton

export default function CreateAnsweredClinicalRecords({ clinicalRecordNumber }) {
  const { user } = useContext(AuthContext);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario

  const handleAnswerChange = (event) => setAnswer(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Esto previene la acción por defecto y permite manejar el envío
    setLoading(true);

    try {
      // Solo enviar 'clinicalRecordNumber', 'email' y 'answer'
      const response = await axios.post("http://localhost:5000/api/answered-clinical-records", {
        clinicalRecordNumber,
        email: user.email,
        answer,
      });
      alert("Respuesta enviada con éxito.");
      setAnswer(""); // Limpiar la respuesta después de enviar
    } catch (error) {
      setError("Hubo un error al enviar la respuesta.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar el formulario al hacer clic en "Ingresar"
  const handleIngresarClick = () => {
    setShowForm(true);
  };

  // Función para ocultar el formulario y regresar al estado inicial
  const handleCancelClick = () => {
    setShowForm(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">Responder Ficha Clínica</h3>
      
      {!showForm ? (
        <ToggleButton
          isVisible={false}
          onToggle={handleIngresarClick}
          showText="Ingresar"
          hideText="Ingresar"
          className="bg-blue-500 text-white"
        />
      ) : (
        <div>
          {error && <div className="text-red-500">{error}</div>}
          
          {/* Aquí está el formulario */}
          <form onSubmit={handleSubmit}> {/* Aseguramos que onSubmit esté correctamente aplicado */}
            <div className="mb-4">
              <label className="block mb-2">Tu Respuesta</label>
              <textarea
                value={answer}
                onChange={handleAnswerChange}
                required
                rows="4"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className={`p-2 bg-blue-500 text-white rounded-md ${loading ? "opacity-50" : ""}`}
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Respuesta"}
              </button>

              {/* Botón para cancelar y regresar al estado inicial */}
              <ToggleButton
                isVisible={true}
                onToggle={handleCancelClick}
                showText="Cancelar"
                hideText="Cancelar"
                className="bg-red-500 text-white"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
