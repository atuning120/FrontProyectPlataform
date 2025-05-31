import { useState } from 'react';

export function useFormatForm(formats) {
  const [selectedFormatIds, setSelectedFormatIds] = useState([]);
  const [responses, setResponses] = useState({}); // Estructura: { formatId: { key: value } }

  const handleFormatSelectionChange = (formatId, isSelected) => {
    setSelectedFormatIds(prevSelectedIds => {
      const newSelectedIds = isSelected
        ? [...prevSelectedIds, formatId]
        : prevSelectedIds.filter(id => id !== formatId);

      setResponses(prevResponses => {
        const newResponses = { ...prevResponses };
        if (isSelected) {
          if (!newResponses[formatId]) {
            const format = formats.find(f => f.id === formatId);
            const initialFormatResponses = {};
            format?.sections?.forEach(section => {
              (section.fields || []).forEach(field => {
                initialFormatResponses[field.key] = field.type === "checkbox_group" 
                                                    ? null 
                                                    : (field.type === "evaluation_scale" 
                                                       ? (field.min ?? 0) 
                                                       : "");
              });
            });
            newResponses[formatId] = initialFormatResponses;
          }
        } else {
          delete newResponses[formatId];
        }
        return newResponses;
      });
      return newSelectedIds;
    });
  };

  const handleInputChange = (formatId, key, value) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [formatId]: {
        ...(prevResponses[formatId] || {}),
        [key]: value,
      },
    }));
  };

  const selectedFormats = formats.filter(f => selectedFormatIds.includes(f.id));

  return {
    selectedFormats,
    selectedFormatIds,
    responses,
    handleFormatSelectionChange,
    handleInputChange,
  };
}