import React from 'react';

/** Campo de formulario del panel de administración (tema oscuro). */
export default function AdminField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  hint = '',
  textarea = false,
  rows = 3,
  options,
}) {
  const inputClass =
    'w-full border border-background/20 bg-background/5 px-3 py-2.5 text-sm text-background outline-none transition placeholder:text-background/35 focus:border-primary focus:ring-2 focus:ring-primary/30';

  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.62rem] uppercase tracking-wide-luxe text-background/55">{label}</span>

      {options ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-foreground">
              {option.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          value={value}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${inputClass} resize-none leading-relaxed`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}

      {hint && <span className="text-[0.6rem] leading-relaxed text-background/45">{hint}</span>}
    </label>
  );
}