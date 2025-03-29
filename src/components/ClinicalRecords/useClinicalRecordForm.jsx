import { useState } from "react";

export function useClinicalRecordForm(initialData) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Función para validar el RUN chileno
  const validateRun = (runDigits, runVerifier) => {
    // Eliminar puntos del RUN para validarlo correctamente
    const cleanedRunDigits = runDigits.replace(/\./g, "");

    // Validar que los dígitos sean numéricos y tengan entre 7 y 8 caracteres
    if (!/^(\d{7,8})$/.test(cleanedRunDigits)) return false;

    // Validar que el dígito verificador sea un número o la letra K
    if (!/^[0-9Kk]$/.test(runVerifier)) return false;

    return true;
  };

  // Función para validar el formulario
  const validateForm = () => {
    let newErrors = {};

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

  // Función para manejar los cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "patientRunDigits") {
      // Limpiar el valor para permitir solo números
      let cleanedValue = value.replace(/\D/g, "").slice(0, 8);
      let formattedValue = "";

      // Formatear con puntos
      if (cleanedValue.length > 6) {
        formattedValue = `${cleanedValue.slice(0, cleanedValue.length - 6)}.${cleanedValue.slice(-6, -3)}.${cleanedValue.slice(-3)}`;
      } else if (cleanedValue.length > 3) {
        formattedValue = `${cleanedValue.slice(0, cleanedValue.length - 3)}.${cleanedValue.slice(-3)}`;
      } else {
        formattedValue = cleanedValue;
      }

      setFormData({ ...formData, patientRunDigits: formattedValue });
    } else if (name === "patientRunVerifier") {
      // Limpiar el valor para permitir solo números o la letra K
      const cleanedValue = value.replace(/[^0-9Kk]/g, "").slice(0, 1).toUpperCase();
      setFormData({ ...formData, patientRunVerifier: cleanedValue });
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
