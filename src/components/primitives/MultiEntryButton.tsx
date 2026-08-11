import React from 'react';
import { Plus } from 'lucide-react';

interface MultiEntryButtonProps {
  label: string;
  count: number;
  onClick: () => void;
  isDarkMode: boolean;
}

export const MultiEntryButton: React.FC<MultiEntryButtonProps> = ({
  label,
  count,
  onClick,
  isDarkMode
}) => {
  const buttonClass = isDarkMode
    ? 'border-bright-gray/30 hover:bg-white/5 text-white'
    : 'border-vintage-charcoal/30 hover:bg-vintage-charcoal/5 text-vintage-charcoal';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${buttonClass}`}
    >
      <span className="flex items-center gap-2 text-caption font-semibold opacity-90">
        <Plus size={16} />
        {label}
      </span>
      {count > 0 && (
        <span className="text-micro font-medium bg-space-sparkle text-bright-gray px-2.5 py-0.5 rounded-full">
          {count} Added
        </span>
      )}
    </button>
  );
};
