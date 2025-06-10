import { useState } from "react";

/**
 * Hook para gestionar:
 *  - formatos seleccionados
 *  - respuestas de cada formato
 */
export function useFormatForm(formats) {
  const [selectedFormatIds, setSelectedFormatIds] = useState([]);
  const [responses, setResponses] = useState({}); // { formatId: { key: value } }

  /** Seleccionar / deseleccionar formato */
  const handleFormatSelectionChange = (formatId, isSelected) => {
    setSelectedFormatIds((prev) => {
      const newIds = isSelected
        ? [...prev, formatId]
        : prev.filter((id) => id !== formatId);

      /* si se selecciona un formato por primera vez → inicializa respuestas */
      if (isSelected && !responses[formatId]) {
        const format = formats.find((f) => f.id === formatId);
        const initial = {};

        format?.sections?.forEach((section) =>
          (section.fields ?? []).forEach((field) => {
            switch (field.type) {
              case "checkbox_group":
              case "image_radio":
                initial[field.key] = null;
                break;
              case "evaluation_scale":
                initial[field.key] =
                  field.min !== undefined ? field.min : 0;
                break;
              default:
                initial[field.key] = "";
            }
          }),
        );

        setResponses((prevR) => ({ ...prevR, [formatId]: initial }));
      }

      return newIds;
    });
  };

  /** Actualizar valor de un campo */
  const handleInputChange = (formatId, key, value) => {
    setResponses((prev) => ({
      ...prev,
      [formatId]: {
        ...(prev[formatId] ?? {}),
        [key]: value,
      },
    }));
  };

  const selectedFormats = formats.filter((f) =>
    selectedFormatIds.includes(f.id),
  );

  return {
    selectedFormats,
    selectedFormatIds,
    responses,
    handleFormatSelectionChange,
    handleInputChange,
  };
}
