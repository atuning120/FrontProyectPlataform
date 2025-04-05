import { useState } from "react";

export function useClinicalRecordForm(initialData) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const validateRun = (runDigits, runVerifier) => {
    const cleanedDigits = runDigits.replace(/\./g, "");
    return /^(\d{7,8})$/.test(cleanedDigits) && /^[0-9Kk]$/.test(runVerifier);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientRunDigits || !formData.patientRunVerifier) {
      newErrors.patientRunDigits = "El RUN es obligatorio.";
    } else if (!validateRun(formData.patientRunDigits, formData.patientRunVerifier)) {
      newErrors.patientRunDigits = "El RUN ingresado no es válido.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "El contenido de la ficha clínica es obligatorio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "patientRunDigits") {
      updatedValue = value.replace(/\D/g, "").slice(0, 8);
      if (updatedValue.length > 6) {
        updatedValue = `${updatedValue.slice(0, -6)}.${updatedValue.slice(-6, -3)}.${updatedValue.slice(-3)}`;
      } else if (updatedValue.length > 3) {
        updatedValue = `${updatedValue.slice(0, -3)}.${updatedValue.slice(-3)}`;
      }
    } else if (name === "patientRunVerifier") {
      updatedValue = value.replace(/[^0-9Kk]/g, "").slice(0, 1).toUpperCase();
    }

    setFormData({ ...formData, [name]: updatedValue });
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  return { formData, setFormData, errors, validateForm, handleChange };
}
