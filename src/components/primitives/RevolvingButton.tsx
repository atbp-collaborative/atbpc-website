import React from 'react';
import { useTheme } from '@/lib/theme-context';

interface RevolvingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const RevolvingButton: React.FC<RevolvingButtonProps> = ({ 
  children, 
  active = true,
  className = '',
  disabled,
  ...props 
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`relative rounded-xl overflow-hidden p-[1px] bg-space-sparkle/20 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {/* Revolving Conic Gradient Border */}
      {active && !disabled && (
        <div className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--color-space-sparkle)_20%,transparent_20%,transparent_50%,var(--color-space-sparkle)_70%,transparent_70%,transparent_100%)]" />
      )}
      
      {/* Inner Button Container */}
      <button
        disabled={disabled}
        className={`relative z-10 w-full h-full rounded-[11px] py-2 px-4 text-caption font-medium transition-all hover:opacity-90 
          ${isDarkMode ? 'bg-vintage-charcoal text-white' : 'bg-white text-vintage-charcoal'}
          ${className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};
