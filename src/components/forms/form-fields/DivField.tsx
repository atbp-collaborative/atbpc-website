import React from 'react';
import { DivFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles } from './fieldStyles';

type DivFieldProps = Omit<DivFieldConfig, 'type'> & FieldRenderProps<string>;

export const DivField: React.FC<DivFieldProps> = ({
  name,
  label,
  placeholder,
  grow = false,
  value,
  isDarkMode,
  theme = 'neutral',
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);

  // Match standard textarea/input classes but keep it non-editable and hide scrollbars.
  const containerClass = `w-full ${
    grow ? 'flex-1 min-h-[120px] lg:min-h-[70px]' : ''
  } p-3 rounded-lg border text-caption transition-all overflow-y-auto no-scrollbar whitespace-pre-wrap ${styles.borderColor}`;

  const renderDescriptionText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, index) => {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const linkText = match[1];
        const linkUrl = match[2];
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-space-sparkle hover:underline font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            {linkText}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className={`space-y-1 ${grow ? 'flex-1 flex flex-col min-h-[120px] lg:min-h-[70px]' : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={containerClass}>
        {value ? (
          renderDescriptionText(value)
        ) : (
          <span className="opacity-40 italic">{placeholder}</span>
        )}
      </div>
    </div>
  );
};
