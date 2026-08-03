import React from 'react';
import { SelectFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles } from './fieldStyles';

type SelectFieldProps = SelectFieldConfig & FieldRenderProps<string>;

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  placeholder,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);
  const selectClass = theme === 'accent'
    ? styles.input
    : `w-full text-caption py-2 px-3 rounded-lg border outline-none transition-all cursor-pointer ${styles.borderColor}`;

  return (
    <div className="space-y-1">
      <label className={styles.label}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={selectClass}
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
    </div>
  );
};
