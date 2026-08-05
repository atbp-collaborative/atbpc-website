import React from 'react';
import { TextFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles } from './fieldStyles';

type TextFieldProps = TextFieldConfig & FieldRenderProps<string>;

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  badge,
  note,
  required,
  placeholder = '-',
  type = 'text',
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);

  return (
    <div className="space-y-0.5">
      <label className={`${styles.label} truncate`}>
        {label}
        {required && ' *'}
        {badge && <span className="text-space-sparkle font-normal"> ({badge})</span>}
        {note && <span className="text-micro font-archivo font-normal opacity-70"> {note}</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
};
