import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthProvider";
import { useFormatForm } from "./useFormatForm";
import formats from "../../data/formats.json";

export default function CreateAnsweredClinicalRecords({ clinicalRecordNumber, patientRun, onSubmit, onPatientLoaded }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientData, setPatientData] = useState(null);

  const { selectedFormat, responses, handleFormatChange, handleInputChange } = useFormatForm(formats);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/${patientRun}`);
        setPatientData(response.data);
        if (onPatientLoaded) {
          onPatientLoaded(response.data.fullName); // 👈 Aquí se pasa el nombre al padre
        }
      } catch (err) {
        setError("Error obteniendo los datos del paciente.");
        console.error("Error obteniendo datos del paciente:", err);
      }
    };

    if (patientRun) {
      fetchPatientData();
    }
  }, [patientRun]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/answered-clinical-records", {
        clinicalRecordNumber,
        email: user.email,
        answer: responses,
      });

      alert("Respuesta enviada con éxito.");
      if (onSubmit) onSubmit();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Hubo un error al enviar la respuesta.";
      setError(errorMessage);
      alert(errorMessage);
      console.error("Error al enviar la respuesta:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {patientData && (
        <div className="mb-4 p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold mb-2">Datos del Paciente</h3>
          <p>
            <strong>Nombre:</strong> {patientData.fullName}  
            <strong> Género:</strong> {patientData.gender}  
            <strong> Edad:</strong> {patientData.age}  
            <strong> Seguro:</strong> {patientData.insurance}  
            <strong> Dirección:</strong> {patientData.address}  
            <strong> Teléfono:</strong> {patientData.mobileNumber}  
            <strong> Email:</strong> {patientData.email}
          </p>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="format" className="block mb-2"></label>
        <select
          id="format"
          onChange={(e) => handleFormatChange(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Seleccionar formato</option>
          {formats.map((format) => (
            <option key={format.id} value={format.id}>
              {format.name}
            </option>
          ))}
        </select>
      </div>

      {selectedFormat?.sections?.length > 0 && (
        <form onSubmit={handleSubmit}>
          {selectedFormat.sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{section.section}</h3>
              {section.fields.map(({ key, label }) => (
                <div key={key} className="mb-4">
                  <label className="block mb-1 font-medium">{label}</label>
                  <textarea
                    value={responses[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    required
                    rows="3"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              ))}
            </div>
          ))}

          <button
            type="submit"
            className={`p-2 bg-blue-500 text-white rounded-md ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Respuesta"}
          </button>
        </form>
      )}
    </div>
  );
}
