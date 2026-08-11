import React from 'react';

interface AtbpLogoProps {
  className?: string;
  isDarkMode?: boolean;
  isHeaderTransparent?: boolean;
}

export const AtbpLogo: React.FC<AtbpLogoProps> = ({
  className = "h-7 w-auto",
  isDarkMode = true,
  isHeaderTransparent = false,
}) => {
  const isWhite = isHeaderTransparent || isDarkMode;

  return (
    <img
      src={isWhite ? "/logo-white.svg" : "/logo-charcoal.svg"}
      alt="ATBP Collaborative"
      className={className}
    />
  );
};
