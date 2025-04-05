// Componente de tabla reutilizable con encabezados dinámicos y datos
export default function TableComponent({ columns, data }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="border p-2 text-left">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  No hay datos disponibles.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="border-t">
                  {columns.map((col) => (
                    <td key={col.key} className="border p-2">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
}
  