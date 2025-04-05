import { useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";

export default function Feedback({ recordId, initialFeedback, onSave }) {
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState(initialFeedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Evita re-render innecesario
  const handleFeedbackChange = useCallback((e) => {
    setFeedback(e.target.value);
  }, []);

  const handleSubmit = async () => {
    const trimmedFeedback = feedback.trim();
    if (!trimmedFeedback) {
      setError("La retroalimentación no puede estar vacía.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await axios.put(`http://localhost:5000/api/answered-clinical-records/${recordId}`, {
        feedback: trimmedFeedback,
        teacherEmail: user?.email,
      });

      onSave(); // Llamamos a la función onSave después de guardar la retroalimentación
    } catch (err) {
      setError("Error al actualizar la retroalimentación.");
      console.error("Error al actualizar la retroalimentación:", err);
    } finally {
      setIsSubmitting(false);
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
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${(!feedback.trim() || isSubmitting) ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!feedback.trim() || isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Guardar Retroalimentación"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
