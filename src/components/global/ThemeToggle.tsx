import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle, className = '' }) => {
  return (
    <Button type="iconOnly" onClick={onToggle} title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'} aria-label={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'} className={`rounded-md border flex items-center justify-center shrink-0 ${isDarkMode ? 'border-bright-gray/20 text-bright-gray/80 hover:text-white hover:border-bright-gray/40' : 'border-vintage-charcoal/20 text-vintage-charcoal/80 hover:text-black hover:border-vintage-charcoal/40'} ${className}`}>
      {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
    </Button>
  );
};
