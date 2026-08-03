import React from 'react';
import { ChoiceCardFieldConfig, FieldRenderProps } from './types';

type ChoiceCardFieldProps = ChoiceCardFieldConfig & FieldRenderProps<string>;

export const ChoiceCardField: React.FC<ChoiceCardFieldProps> = ({
  name,
  options,
  columns = 2,
  value,
  onChange,
}) => {
  const colsClass = columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';
  // Cards with a `highlight` (e.g. a price range) push their description to
  // the bottom of the card; plain cards just stack top-aligned.
  const hasHighlight = options.some((opt) => opt.highlight);

  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-4`}>
      {options.map((opt) => {
        const isSelected = value === opt.id;
        const cardClass = `p-4 rounded-none border cursor-pointer transition-all ${
          hasHighlight ? 'flex flex-col justify-between' : ''
        } ${
          isSelected
            ? 'border-space-sparkle bg-space-sparkle/10 ring-1 ring-space-sparkle'
            : 'border-space-sparkle/15 hover:bg-space-sparkle/5'
        }`;

        return (
          <div key={opt.id} onClick={() => onChange(name, opt.id, opt)} className={cardClass}>
            {hasHighlight ? (
              <>
                <div>
                  <span className="text-body font-bold block">{opt.label}</span>
                  <span className="text-h2 font-sans font-bold text-space-sparkle block mt-1">{opt.highlight}</span>
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
