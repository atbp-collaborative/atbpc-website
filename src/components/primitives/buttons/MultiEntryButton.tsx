import React from 'react';
import { Plus, Check } from 'lucide-react';

interface MultiEntryButtonProps {
  label: string;
  fieldLabel?: string;
  count?: number;
  showCheck?: boolean;
  onClick: () => void;
  isDarkMode: boolean;
}

export const MultiEntryButton: React.FC<MultiEntryButtonProps> = ({
  label,
  fieldLabel,
  count = 0,
  showCheck,
  onClick,
  isDarkMode
}) => {
  const buttonClass = isDarkMode
    ? 'border-bright-gray/30 hover:bg-white/5 text-white'
    : 'border-vintage-charcoal/30 hover:bg-vintage-charcoal/5 text-vintage-charcoal';

  const isChecked = showCheck !== undefined ? showCheck : count === 1;

  return (
    <div className="flex flex-col gap-0.5 w-full min-w-0">
      {fieldLabel && (
        <label className="text-caption font-semibold block opacity-90 truncate w-full">
          {fieldLabel}
        </label>
      )}
      <button
        type="button"
        onClick={onClick}
        className={`w-full py-1.5 px-3 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${buttonClass} min-w-0`}
      >
        <span className="flex items-center gap-2 text-caption font-semibold opacity-90 min-w-0 overflow-hidden flex-1">
          <Plus size={16} className="shrink-0" />
          <span className="truncate">{label}</span>
        </span>
        {isChecked ? (
          <span className="flex items-center justify-center text-emerald-500 font-bold shrink-0 ml-2">
            <Check size={18} className="stroke-[2.5]" />
          </span>
        ) : count > 1 ? (
          <span className="text-micro font-medium bg-space-sparkle text-bright-gray px-2.5 py-0.5 rounded-full shrink-0 ml-2">
            {count} Added
          </span>
        ) : null}
      </button>
    </div>
  );
};
