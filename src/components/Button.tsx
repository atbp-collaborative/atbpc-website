import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'filled' | 'outline';
  label: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'filled',
  label,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = "font-medium uppercase tracking-widest text-caption rounded-none transition-all flex items-center justify-center cursor-pointer whitespace-nowrap shrink-0 select-none";
  
  const typeStyles = type === 'filled'
    ? "bg-space-sparkle text-bright-gray hover:bg-space-sparkle/85 shadow-sm hover:shadow-md py-2.5 px-5"
    : "bg-transparent border border-white/50 text-white hover:bg-white/10 hover:border-white py-3.5 px-8";
    
  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      {...props}
      className={`${baseStyles} ${typeStyles} ${widthStyles} ${className}`}
    >
      <span>{label}</span>
    </button>
  );
};
