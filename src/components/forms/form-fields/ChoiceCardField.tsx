import React from 'react';
import { ChoiceCardFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles, FieldTheme } from './fieldStyles';

type ChoiceCardFieldProps = ChoiceCardFieldConfig & FieldRenderProps<string>;

export const ChoiceCardField: React.FC<ChoiceCardFieldProps> = ({
  name,
  options,
  columns = 2,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);
  const colsClass = columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
  // Cards with a `highlight` (e.g. a price range) push their description to
  // the bottom of the card; plain cards just stack top-aligned.
  const hasHighlight = options.some((opt) => opt.highlight);

  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-4`}>
      {options.map((opt) => {
        const isSelected = value === opt.id;
        const cardClass = `p-4 ${theme === 'accent' ? 'rounded-none' : 'rounded-lg'} border cursor-pointer transition-all ${
          hasHighlight ? 'flex flex-col justify-between' : ''
        } ${
          isSelected
            ? `${styles.borderColor} bg-white/5 ring-1 ${styles.borderColor.replace('border-', 'ring-')}`
            : `${styles.borderColor} opacity-50 hover:opacity-100 hover:bg-white/5`
        }`;

        return (
          <div key={opt.id} onClick={() => onChange(name, opt.id, opt)} className={cardClass}>
            {hasHighlight ? (
              <>
                <div>
                  <span className="text-body font-bold block">{opt.label}</span>
                  <span className={`text-h2 font-sans font-bold block mt-1 ${
                    theme === 'accent' ? 'text-space-sparkle' : isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>{opt.highlight}</span>
                </div>
                {opt.desc && (
                  <span className="text-caption opacity-70 block mt-3 leading-normal">{opt.desc}</span>
                )}
              </>
            ) : (
              <>
                <span className="text-body font-bold block">{opt.label}</span>
                {opt.desc && (
                  <span className="text-caption opacity-70 block mt-1 leading-normal">{opt.desc}</span>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
