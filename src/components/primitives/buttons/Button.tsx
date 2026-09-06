import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> {
  type?: 'filled' | 'outline' | 'revolving' | 'ghost' | 'iconOnly';
  htmlType?: 'button' | 'submit' | 'reset';
  label?: string;
  fullWidth?: boolean;
  /** Optional trailing icon rendered after the label */
  children?: React.ReactNode;
  /** When set, renders as a real Link to this route instead of a <button> */
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'filled',
  htmlType,
  label,
  fullWidth = false,
  className = '',
  children,
  href,
  target,
  rel,
  onClick,
  active = true,
  disabled,
  ...props
}) => {
  const { isDarkMode } = useTheme();

  if (type === 'revolving') {
    return (
      <div className={`relative rounded-xl overflow-hidden p-[1px] bg-space-sparkle/20 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${fullWidth ? 'w-full' : ''}`}>
        {active && !disabled && (
          <div className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--color-space-sparkle)_20%,transparent_20%,transparent_50%,var(--color-space-sparkle)_70%,transparent_70%,transparent_100%)]" />
        )}
        <button
          type={htmlType || 'button'}
          disabled={disabled}
          onClick={onClick}
          className={`relative z-10 w-full h-full rounded-[11px] py-2 px-4 text-caption font-medium transition-all hover:opacity-90 ${isDarkMode ? 'bg-vintage-charcoal text-white' : 'bg-white text-vintage-charcoal'} ${className}`}
          {...props}
        >
          {label && <span>{label}</span>}
          {children}
        </button>
      </div>
    );
  }

  const baseStyles = "transition-all flex items-center justify-center cursor-pointer shrink-0 select-none";
  
  let typeStyles = "";
  if (type === 'filled') {
    typeStyles = "font-medium uppercase tracking-widest text-caption rounded-none whitespace-nowrap bg-space-sparkle text-bright-gray hover:bg-space-sparkle/85 shadow-sm hover:shadow-md py-2.5 px-5";
  } else if (type === 'outline') {
    typeStyles = "font-medium uppercase tracking-widest text-caption rounded-none whitespace-nowrap bg-transparent border border-white/50 text-white hover:bg-white/10 hover:border-white py-3.5 px-8";
  } else if (type === 'ghost') {
    typeStyles = "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-current transition-colors";
  } else if (type === 'iconOnly') {
    typeStyles = "p-2 rounded-full bg-transparent text-current hover:bg-black/10 dark:hover:bg-white/10 transition-colors";
  }

  const disabledStyles = "disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-400/20 disabled:text-gray-400 disabled:border-transparent disabled:hover:bg-gray-400/20 disabled:hover:shadow-none";
  const widthStyles = fullWidth ? "w-full" : "";

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={`${baseStyles} ${typeStyles} ${widthStyles} ${className}`}
      >
        {label && <span>{label}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      {...props}
      type={htmlType || 'button'}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${typeStyles} ${widthStyles} ${disabledStyles} ${className}`}
    >
      {label && <span>{label}</span>}
      {children}
    </button>
  );
};
