'use client';

import React from 'react';
import { DateFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles } from './fieldStyles';

type DateFieldProps = Omit<DateFieldConfig, 'type'> & { type?: DateFieldConfig['type']; disabled?: boolean } & FieldRenderProps<string>;

export const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
  required,
  badge,
  note,
  disabled
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);

  return (
    <div className={`flex flex-col space-y-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {label && (
        <label className="text-caption font-sans font-medium text-space-sparkle flex items-baseline">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {badge && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-space-sparkle/10 text-space-sparkle">{badge}</span>}
          {note && <span className="ml-2 text-micro opacity-60 font-normal">{note}</span>}
        </label>
      )}
      <input
        type="date"
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        disabled={disabled}
        className={`${styles.input} [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
      />
    </div>
  );
};
