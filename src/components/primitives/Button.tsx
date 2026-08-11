import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> {
  type?: 'filled' | 'outline';
  label: string;
  fullWidth?: boolean;
  /** Optional trailing icon rendered after the label */
  children?: React.ReactNode;
  /** When set, renders as a real Link to this route instead of a <button> */
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'filled',
  label,
  fullWidth = false,
  className = '',
  children,
  href,
  target,
  rel,
  onClick,
  ...props
}) => {
  const baseStyles = "font-medium uppercase tracking-widest text-caption rounded-none transition-all flex items-center justify-center cursor-pointer whitespace-nowrap shrink-0 select-none";

  const typeStyles = type === 'filled'
    ? "bg-space-sparkle text-bright-gray hover:bg-space-sparkle/85 shadow-sm hover:shadow-md py-2.5 px-5"
    : "bg-transparent border border-white/50 text-white hover:bg-white/10 hover:border-white py-3.5 px-8";

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
        <span>{label}</span>
        {children}
      </Link>
    );
  }

  return (
    <button
      {...props}
      onClick={onClick}
      className={`${baseStyles} ${typeStyles} ${widthStyles} ${disabledStyles} ${className}`}
    >
      <span>{label}</span>
      {children}
    </button>
  );
};
