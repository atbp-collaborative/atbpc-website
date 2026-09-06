import React from 'react';
import Image from 'next/image';

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
  const src = isWhite ? "/logo-white.svg" : "/logo-charcoal.svg";

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt="ATBP Collaborative"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};
