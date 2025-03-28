import { useState } from "react";

export function useClinicalRecordForm(initialData) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientRun.trim()) {
      newErrors.patientRun = "El RUN del paciente es obligatorio.";
    }
    if (!formData.content.trim()) {
      newErrors.content = "El contenido de la ficha clínica es obligatorio.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar los cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "patientRun") {
      // Extraer solo dígitos
      let cleanedValue = value.replace(/\D/g, "");
      // Limitar a 9 dígitos
      if (cleanedValue.length > 9) {
        cleanedValue = cleanedValue.slice(0, 9);
      }
      let formattedValue = "";
      if (cleanedValue.length <= 2) {
        formattedValue = cleanedValue;
      } else if (cleanedValue.length <= 5) {
        formattedValue = `${cleanedValue.slice(0, 2)}.${cleanedValue.slice(2)}`;
      } else if (cleanedValue.length <= 8) {
        formattedValue = `${cleanedValue.slice(0, 2)}.${cleanedValue.slice(2, 5)}.${cleanedValue.slice(5)}`;
      } else {
        formattedValue = `${cleanedValue.slice(0, 2)}.${cleanedValue.slice(2, 5)}.${cleanedValue.slice(5, 8)}-${cleanedValue.slice(8)}`;
      }
      setFormData({ ...formData, patientRun: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  return {
    formData,
    setFormData,
    errors,
    validateForm,
    handleChange,
  };
}
