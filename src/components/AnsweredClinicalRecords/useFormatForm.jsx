import { useState } from 'react';

export function useFormatForm(formats) {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [responses, setResponses] = useState({});

  const handleFormatChange = (formatId) => {
    const format = formats.find((f) => f.id === formatId);
    setSelectedFormat(format);
    setResponses({}); // Limpiar respuestas previas
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
