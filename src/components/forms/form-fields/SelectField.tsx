import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SelectFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles } from './fieldStyles';

type SelectFieldProps = Omit<SelectFieldConfig, 'type' | 'label'> & FieldRenderProps<string> & {
  label?: React.ReactNode;
  disabled?: boolean;
  /** Tighter vertical padding (py-1.5 instead of py-2) to match a denser surrounding layout. */
  dense?: boolean;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  placeholder,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
  disabled = false,
  dense = false,
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);
  // Native <select> arrows sit flush against the border regardless of padding, so we hide the
  // native one (appearance-none) and render our own ChevronDown with deliberate spacing instead.
  const selectClass = theme === 'accent'
    ? `${styles.input} appearance-none pr-9`
    : `w-full text-caption ${dense ? 'py-1.5' : 'py-2'} pl-3 pr-9 rounded-lg border outline-none transition-all appearance-none ${styles.borderColor}`;

  return (
    <div className="space-y-1">
      {label && <label className={styles.label}>{label}</label>}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={disabled}
          className={`${selectClass} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => {
            const { value: optValue, label: optLabel } = typeof opt === 'string' ? { value: opt, label: opt } : opt;
            return (
              <option key={optValue} value={optValue} className="bg-vintage-charcoal text-white">
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={14}
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${disabled ? 'opacity-30' : 'opacity-60'}`}
        />
      </div>
    </div>
  );
};
