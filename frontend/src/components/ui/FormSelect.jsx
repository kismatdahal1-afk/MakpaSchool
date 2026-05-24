const FormSelect = ({ label, name, value, onChange, error, options = [], required = false }) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition ${
          error
            ? "border-rose-300 focus:border-rose-500"
            : "border-slate-200 focus:border-brand-500"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
};

export default FormSelect;
