import { useState } from "react";

export default function PaginationComponent({ 
  data, 
  itemsPerPage = 10, 
  renderItem,
  renderTable,
  containerClassName = "",
  paginationClassName = "flex justify-center items-center mt-4 space-x-2"
}) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, page)));
  };

  const goToPrevious = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);

  // Si hay menos datos que itemsPerPage, no mostrar paginación
  if (data.length <= itemsPerPage) {
    return renderTable ? renderTable(data) : (
      <div className={containerClassName}>
        {data.map(renderItem)}
      </div>
    );
  }

  return (
    <div>
      {/* Datos actuales */}
      {renderTable ? renderTable(currentData) : (
        <div className={containerClassName}>
          {currentData.map(renderItem)}
        </div>
      )}

      {/* Controles de paginación */}
      <div className={paginationClassName}>
        <button
          onClick={goToPrevious}
          disabled={currentPage === 0}
          className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
        >
          ← Anterior
        </button>

        <div className="flex space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageIndex;
            if (totalPages <= 5) {
              pageIndex = i;
            } else if (currentPage <= 2) {
              pageIndex = i;
            } else if (currentPage >= totalPages - 3) {
              pageIndex = totalPages - 5 + i;
            } else {
              pageIndex = currentPage - 2 + i;
            }

            return (
              <button
                key={pageIndex}
                onClick={() => goToPage(pageIndex)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  currentPage === pageIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {pageIndex + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={goToNext}
          disabled={currentPage === totalPages - 1}
          className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
        >
          Siguiente →
        </button>
      </div>

      {/* Información de página */}
      <div className="text-center mt-2 text-sm text-gray-600">
        Mostrando {startIndex + 1}-{Math.min(endIndex, data.length)} de {data.length} elementos
        (Página {currentPage + 1} de {totalPages})
      </div>
    </div>
  );
}
