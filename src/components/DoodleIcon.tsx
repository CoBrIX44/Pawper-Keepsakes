import React from 'react';
import { CardDoodle } from '../types/scrapbook';

interface DoodleIconProps {
  type: CardDoodle;
  size?: number;
  className?: string;
  color?: string;
}

export const DoodleIcon: React.FC<DoodleIconProps> = ({
  type,
  size = 20,
  className = '',
  color = 'currentColor',
}) => {
  switch (type) {
    case 'heart':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
        </svg>
      );

    case 'star':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );

    case 'flower':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" fill={color} fillOpacity="0.25" />
          {/* 5 rounded petals */}
          <path d="M12 9a3 3 0 0 0-3-3 3 3 0 0 0 0 6" />
          <path d="M14.85 14.07a3 3 0 0 0 .93-4.14 3 3 0 0 0-5.2 3.01" />
          <path d="M9.15 14.07a3 3 0 0 1-.93-4.14 3 3 0 0 1 5.2 3.01" />
          <path d="M12 15a3 3 0 0 0 3 3 3 3 0 0 0 0-6" />
        </svg>
      );

    case 'sparkle':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 3c0 4.5-4.5 9-9 9 4.5 0 9 4.5 9 9 0-4.5 4.5-9 9-9-4.5 0-9-4.5-9-9z" />
          <circle cx="19" cy="5" r="1" fill={color} />
          <circle cx="5" cy="19" r="1" fill={color} />
        </svg>
      );

    default:
      return null;
  }
};
