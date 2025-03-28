import { useState } from "react";

export const usePatientForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Función para validar el formulario
  const validateForm = () => {
    let newErrors = {};

    // Validación de nombre (mínimo un espacio)
    if (!formData.fullName.trim() || formData.fullName.split(' ').length < 2) {
      newErrors.fullName = "El nombre completo es obligatorio (debe contener al menos un espacio).";
    }

    // Validación de RUN (formato chileno completo)
    if (!formData.run.trim()) newErrors.run = "RUN es obligatorio.";
    else if (!/^\d{2}\.\d{3}\.\d{3}-\d{1}$/.test(formData.run)) {
      newErrors.run = "RUN inválido (debe ser en formato 21.309.690-7).";
    }

    // Validación de sexo
    if (!["Masculino", "Femenino", "Otro"].includes(formData.gender)) newErrors.gender = "Seleccione un sexo válido.";

    // Validación de edad (máximo 3 dígitos)
    if (!/^\d+$/.test(formData.age) || parseInt(formData.age) < 0 || parseInt(formData.age) > 120 || formData.age.length > 3) {
      newErrors.age = "Edad inválida (debe ser un número entre 0 y 120 y máximo 3 dígitos).";
    }

    // Validación de previsión
    if (!["Fonasa", "Isapre"].includes(formData.insurance)) newErrors.insurance = "Previsión inválida (Fonasa o Isapre).";

    // Validación de dirección
    if (!formData.address.trim()) newErrors.address = "La dirección es obligatoria.";

    // Validación del número móvil (9 dígitos, formato 1 2222 3333)
    if (!/^\d{9}$/.test(formData.mobileNumber.replace(/\s/g, ""))) {
      newErrors.mobileNumber = "Número móvil inválido (9 dígitos).";
    }

    // Validación de correo electrónico
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Correo inválido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar los cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "run") {
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
      setFormData({ ...formData, run: formattedValue });
    } else if (name === "mobileNumber") {
      let cleanedValue = value.replace(/\D/g, "");
      if (cleanedValue.length > 9) {
        cleanedValue = cleanedValue.slice(0, 9);
      }
      cleanedValue = cleanedValue.replace(/(\d{1})(\d{4})(\d{4})/, "$1 $2 $3");
      setFormData({ ...formData, mobileNumber: cleanedValue });
    } else if (name === "age") {
      let cleanedValue = value.replace(/\D/g, "");
      if (cleanedValue.length <= 3) {
        setFormData({ ...formData, age: cleanedValue });
      }
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
    handleChange
  };
};
