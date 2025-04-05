import { useState } from 'react';

export function useFormatForm(formats) {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [responses, setResponses] = useState({});

  const handleFormatChange = (formatId) => {
    const format = formats.find((f) => f.id === formatId);
    if (!format || format === selectedFormat) return;

    // Inicializar respuestas vacías con los campos del formato
    const initialResponses = {};
    format.sections?.forEach((section) => {
      section.fields.forEach((field) => {
        initialResponses[field.key] = "";
      });
    });

    setSelectedFormat(format);
    setResponses(initialResponses);
  };

  const handleInputChange = (key, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [key]: value,
    }));
  };

  return {
    selectedFormat,
    responses,
    handleFormatChange,
    handleInputChange,
  };
}
