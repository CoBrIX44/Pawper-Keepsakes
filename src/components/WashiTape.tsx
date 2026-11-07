import React from 'react';
import { CardColor } from '../types/scrapbook';

interface WashiTapeProps {
  color?: CardColor;
  angle?: number;
  pattern?: 'dots' | 'stripes' | 'plain';
  className?: string;
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  color = 'mint',
  angle = -1.2,
  pattern = 'dots',
  className = '',
}) => {
  const colorMap: Record<CardColor, { bg: string; border: string }> = {
    blush: { bg: 'rgba(254, 205, 215, 0.75)', border: 'rgba(244, 114, 182, 0.4)' },
    lilac: { bg: 'rgba(221, 214, 254, 0.75)', border: 'rgba(167, 139, 250, 0.4)' },
    peach: { bg: 'rgba(254, 215, 170, 0.75)', border: 'rgba(251, 146, 60, 0.4)' },
    mint: { bg: 'rgba(187, 247, 208, 0.75)', border: 'rgba(74, 222, 128, 0.4)' },
    lemon: { bg: 'rgba(254, 240, 138, 0.75)', border: 'rgba(234, 179, 8, 0.4)' },
  };

  const current = colorMap[color] || colorMap.mint;

  return (
    <div
      aria-hidden="true"
      className={`washi-tape-strip washi-tape-pattern-${pattern} ${className}`}
      style={{
        backgroundColor: current.bg,
        borderColor: current.border,
        transform: `translateX(-50%) rotate(${angle}deg)`,
      }}
    />
  );
};
