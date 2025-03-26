export default function SelectField({ label, name, value, onChange, options, error }) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 capitalize">
          {label}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`mt-1 p-2 w-full border rounded-lg ${error ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Seleccione...</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
  