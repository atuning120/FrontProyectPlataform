import { useState } from "react";

export const usePatientForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Valida los campos del formulario antes de enviarlo
  const validateForm = () => {
    let newErrors = {};

    // Validación de nombre completo
    if (!formData.fullName.trim() || formData.fullName.split(" ").length < 2) {
      newErrors.fullName = "El nombre completo es obligatorio (debe contener al menos un espacio).";
    }

    // Obtiene el RUN sin puntos
    let runDigits = formData.runDigits || "";
    runDigits = runDigits.replace(/\./g, "");
    
    // Validación de RUN (runDigits)
    if (!runDigits || runDigits.length < 7 || runDigits.length > 8) {
      newErrors.runDigits = "El RUN debe tener entre 7 y 8 dígitos.";
    }

    // Validación del dígito verificador (runVerifier)
    if (!formData.runVerifier || !/^[0-9kK]$/.test(formData.runVerifier)) {
      newErrors.runVerifier = "El dígito verificador debe ser un número o la letra K.";
    }

    // Validación de correo electrónico
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo inválido.";
    }

    // Validación de número móvil (9 dígitos sin espacios)
    if (!/^\d{9}$/.test(formData.mobileNumber.replace(/\s/g, ""))) {
      newErrors.mobileNumber = "Número móvil inválido (9 dígitos).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "runDigits") {
      let cleanedValue = value.replace(/\D/g, "").slice(0, 8);

      let formattedValue = "";
      if (cleanedValue.length > 6) {
        formattedValue = `${cleanedValue.slice(0, cleanedValue.length - 6)}.${cleanedValue.slice(cleanedValue.length - 6, cleanedValue.length - 3)}.${cleanedValue.slice(cleanedValue.length - 3)}`;
      } else if (cleanedValue.length > 3) {
        formattedValue = `${cleanedValue.slice(0, 3)}.${cleanedValue.slice(3)}`;
      } else {
        formattedValue = cleanedValue;
      }

      setFormData({ ...formData, runDigits: formattedValue });
    } 
    
    else if (name === "runVerifier") {
      const cleanedValue = value.replace(/[^0-9kK]/g, "").slice(0, 1).toUpperCase();
      setFormData({ ...formData, runVerifier: cleanedValue });
    } 
    
    else if (name === "mobileNumber") {
      let cleanedValue = value.replace(/\D/g, "").slice(0, 9);
      cleanedValue = cleanedValue.replace(/(\d{1})(\d{4})(\d{4})/, "$1 $2 $3");
      setFormData({ ...formData, mobileNumber: cleanedValue });
    } 
    
    else if (name === "age") {
      let cleanedValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData({ ...formData, age: cleanedValue });
    } 
    
    else {
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
};
