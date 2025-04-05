// Componente de entrada de texto reutilizable con validación de error
export default function InputField({ label, name, value, onChange, error, type = "text" }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 capitalize">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`mt-1 p-2 w-full border rounded-lg ${error ? "border-red-500" : "border-gray-300"}`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
}
  