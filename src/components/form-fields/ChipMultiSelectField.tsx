import React from 'react';
import { ChipMultiSelectFieldConfig, FieldRenderProps } from './types';

type ChipMultiSelectFieldProps = ChipMultiSelectFieldConfig & FieldRenderProps<string[]>;

export const ChipMultiSelectField: React.FC<ChipMultiSelectFieldProps> = ({
  name,
  label,
  options,
  value,
  onChange,
}) => {
  const toggle = (opt: string) => {
    const next = value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt];
    onChange(name, next);
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-body font-bold block">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-none text-caption font-medium border transition-all cursor-pointer ${
              value.includes(opt)
                ? 'bg-space-sparkle text-white border-space-sparkle'
                : 'bg-transparent border-space-sparkle/20 hover:border-space-sparkle/60'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
