import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";

export default function Feedback({ recordId, initialFeedback, onSave }) {
  const { user } = useContext(AuthContext); // Obtenemos el email del profesor
  const [feedback, setFeedback] = useState(initialFeedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Maneja el cambio en el textarea
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  // Función para enviar la retroalimentación al backend
  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setError("La retroalimentación no puede estar vacía.");
      return;
    }

    setIsSubmitting(true);
    setError(""); // Reseteamos el error

    try {
      // Realizamos la solicitud PUT para actualizar el feedback
      await axios.put(`http://localhost:5000/api/answered-clinical-records/${recordId}`, {
        feedback,
        teacherEmail: user?.email, // Enviamos el email del profesor
      });

      setIsSubmitting(false); // Indicamos que la operación ha terminado
      onSave(); // Llamamos a la función onSave después de guardar la retroalimentación

    } catch (err) {
      setIsSubmitting(false);
      setError("Error al actualizar la retroalimentación.");
      console.error("Error al actualizar la retroalimentación:", err);
    }
  };

  return (
    <div>
      <textarea
        className="w-full p-2 border rounded-lg"
        value={feedback}
        onChange={handleFeedbackChange}
        placeholder="Escribe tu retroalimentación aquí..."
      />
      <div className="flex justify-between mt-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Guardar Retroalimentación"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
