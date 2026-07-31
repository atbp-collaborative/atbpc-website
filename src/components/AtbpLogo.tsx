import React from 'react';

interface AtbpLogoProps {
  className?: string;
  isDarkMode?: boolean;
  isHeaderTransparent?: boolean;
}

/**
 * Official ATBP Collaborative Monogram Logo Component
 * Renders the official geometric 'atbp' monogram:
 * - 'a': Half circle on left + filled rectangle on right (round left, flat right & sharp bottom-right corner)
 * - 't': Full circle + top horizontal bar with sharp top-left & top-right corners
 * - 'b': Pure circle
 * - 'p': Full circle + bottom-left rectangle stem (sharp bottom-left corner)
 */
export const AtbpLogo: React.FC<AtbpLogoProps> = ({
  className = "h-7 w-auto",
  isDarkMode = true,
  isHeaderTransparent = false,
}) => {
  const isWhite = isHeaderTransparent || isDarkMode;
  const fillColor = isWhite ? "#FFFFFF" : "#2C2C2E";

  return (
    <svg
      viewBox="0 0 400 100"
      className={className}
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ATBP Collaborative Logo"
    >
      {/* Letter 'a': Round left half, flat top-right & bottom-right */}
      <g>
        <path d="M 50 0 A 50 50 0 0 0 50 100 L 100 100 L 100 0 Z" />
      </g>

      {/* Letter 't': Circle + Top Bar */}
      <g>
        <circle cx="150" cy="50" r="50" />
        <rect x="100" y="0" width="100" height="22" />
      </g>

      {/* Letter 'b': Pure Circle */}
      <g>
        <circle cx="250" cy="50" r="50" />
      </g>

      {/* Letter 'p': Circle + Bottom-Left Stem */}
      <g>
        <circle cx="350" cy="50" r="50" />
        <rect x="300" y="50" width="50" height="50" />
      </g>
    </svg>
  );
};
