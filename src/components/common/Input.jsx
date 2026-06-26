const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  register,
  disabled = false,
  required = false,
  className = "",
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        {...(register ? register(name) : {})}
        className={`
          w-full
          rounded-lg
          border
          border-slate-300
          px-4
          py-3
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
          disabled:bg-slate-100
          ${className}
        `}
      />
    </div>
  );
};

export default Input;