import { useState } from 'react';

export function useFormatForm(formats) {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [responses, setResponses] = useState({});

  const handleFormatChange = (formatId) => {
    const format = formats.find((f) => f.id === formatId);

    if (!format) return;

    // Aplanar los campos desde sections (para facilitar acceso si se necesita)
    const allFields = format.sections?.flatMap((section) => section.fields) || [];

    setSelectedFormat(format);
    setResponses({}); // Limpiar respuestas anteriores
  };

  const handleInputChange = (key, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [key]: value
    }));
  };

  return {
    selectedFormat,
    responses,
    handleFormatChange,
    handleInputChange
  };
}
