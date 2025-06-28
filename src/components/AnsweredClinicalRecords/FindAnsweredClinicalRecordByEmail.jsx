import { useEffect, useState } from "react";
import axios from "axios";

export default function FindAnsweredClinicalRecordByEmail({ userEmail, onAnswered }) {
  const [answeredRecords, setAnsweredRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    const fetchAnsweredRecords = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API}/answered-clinical-records/${userEmail}`);
        setAnsweredRecords(data);
        onAnswered(data);
      } catch (err) {
        console.error("Error al cargar los registros:", err);
        setError("No se pudieron cargar los registros.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnsweredRecords();
  }, [userEmail, onAnswered]);

  if (loading) return <div>Cargando registros...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return null;
}
