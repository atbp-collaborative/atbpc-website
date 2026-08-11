import React from 'react';
import { ChipMultiSelectFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles, FieldTheme } from './fieldStyles';

type ChipMultiSelectFieldProps = ChipMultiSelectFieldConfig & FieldRenderProps<string[]>;

export const ChipMultiSelectField: React.FC<ChipMultiSelectFieldProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);
  const toggle = (opt: string) => {
    const next = value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt];
    onChange(name, next);
  };

  return (
    <div className="space-y-3">
      {label && <label className={styles.label}>{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 ${theme === 'accent' ? 'rounded-none' : 'rounded-lg'} text-caption font-medium border transition-all cursor-pointer ${
              value.includes(opt)
                ? `${styles.borderColor} bg-white/10 dark:bg-white/10`
                : `bg-transparent ${styles.borderColor} opacity-50 hover:opacity-100`
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
