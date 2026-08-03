import React from 'react';

export const neutralFieldClass = (isDarkMode: boolean) =>
  isDarkMode
    ? 'border-bright-gray/30 focus:border-bright-gray bg-vintage-charcoal/50 text-white placeholder-bright-gray/40'
    : 'border-vintage-charcoal/30 focus:border-vintage-charcoal bg-white/60 text-vintage-charcoal placeholder-vintage-charcoal/40';

interface TextFieldProps {
  label: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDarkMode: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  value,
  onChange,
  isDarkMode,
  type = 'text',
  placeholder = '-',
  className = '',
  labelClassName = '',
}) => (
  <div className={`space-y-0.5 ${className}`}>
    <label className={`text-caption font-semibold block opacity-90 ${labelClassName}`}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${neutralFieldClass(isDarkMode)}`}
    />
  </div>
);

interface SelectFieldProps {
  label: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  isDarkMode: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  isDarkMode,
}) => (
  <div className="space-y-1">
    <label className="text-caption font-semibold block opacity-90">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full text-caption py-2 px-3 rounded-lg border outline-none transition-all cursor-pointer ${neutralFieldClass(isDarkMode)}`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-vintage-charcoal text-white">
          {opt}
        </option>
      ))}
    </select>
  </div>
);
