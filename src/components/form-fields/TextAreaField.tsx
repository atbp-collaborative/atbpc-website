import React from 'react';
import { TextAreaFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles } from './fieldStyles';

type TextAreaFieldProps = TextAreaFieldConfig & FieldRenderProps<string>;

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  label,
  badge,
  placeholder,
  variant = 'default',
  rows,
  grow = false,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);

  if (variant === 'compact') {
    // A small bordered box for pasting a link — the box itself carries the
    // border/theme color, the textarea inside it is just a transparent fill.
    return (
      <div className="space-y-1">
        <label className="text-micro font-archivo font-semibold block opacity-90 truncate">
          {label}
          {badge && <span className="text-space-sparkle font-normal"> ({badge})</span>}
        </label>
        <div className={`h-20 p-2 border rounded-xl flex flex-col justify-center ${styles.borderColor}`}>
          <textarea
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            className="w-full h-full bg-transparent text-micro leading-tight outline-none resize-none placeholder-inherit"
          />
        </div>
      </div>
    );
  }

  const textareaClass = theme === 'accent'
    ? styles.input
    : `w-full ${grow ? 'flex-1' : ''} p-3 rounded-lg border outline-none resize-none text-caption transition-all ${styles.borderColor}`;

  return (
    <div className={`space-y-1 ${grow ? 'flex-1 flex flex-col min-h-[120px]' : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={textareaClass}
      />
    </div>
  );
};
