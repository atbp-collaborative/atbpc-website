import React from 'react';
import { Shield, ShieldOff } from 'lucide-react';

interface ProtectionToggleProps {
  isProtectionEnabled: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  className?: string;
}

export const ProtectionToggle: React.FC<ProtectionToggleProps> = ({ 
  isProtectionEnabled, 
  onToggle, 
  isDarkMode,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={isProtectionEnabled ? 'Disable Content Protection' : 'Enable Content Protection'}
      aria-label={isProtectionEnabled ? 'Disable Content Protection' : 'Enable Content Protection'}
      className={`rounded-md border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
        isProtectionEnabled
          ? 'border-space-sparkle/50 text-space-sparkle bg-space-sparkle/10'
          : isDarkMode
          ? 'border-bright-gray/20 text-bright-gray/80 hover:text-white hover:border-bright-gray/40'
          : 'border-vintage-charcoal/20 text-vintage-charcoal/80 hover:text-black hover:border-vintage-charcoal/40'
      } ${className}`}
    >
      {isProtectionEnabled ? <Shield size={13} /> : <ShieldOff size={13} />}
    </button>
  );
};
