import React from 'react';

interface CatMascotProps {
  mode?: 'peeking' | 'resting' | 'paw';
  size?: number;
  className?: string;
}

export const CatMascot: React.FC<CatMascotProps> = ({
  mode = 'peeking',
  size,
  className = '',
}) => {
  if (mode === 'resting') {
    const width = size || 120;
    const height = (width * 80) / 120;
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Sleeping Cushion / Shadow */}
        <ellipse cx="60" cy="72" rx="48" ry="6" fill="#E8DEC8" fillOpacity="0.6" />

        {/* Curled Body */}
        <path
          d="M28 66C22 56 22 42 32 32C42 22 62 20 78 26C94 32 102 46 98 58C94 70 82 72 64 72C46 72 34 72 28 66Z"
          fill="#FAF0E6"
          stroke="#5C4D42"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Soft Pastel Calico Patches */}
        <path
          d="M65 24C75 27 82 34 84 42C78 44 70 38 65 30C63 27 64 25 65 24Z"
          fill="#FED7AA"
        />
        <path
          d="M32 40C28 46 26 54 30 60C32 55 35 48 38 43C36 41 33 40 32 40Z"
          fill="#FBCFE8"
        />

        {/* Head */}
        <circle cx="82" cy="46" r="18" fill="#FFF8F0" stroke="#5C4D42" strokeWidth="2.5" />

        {/* Left Ear */}
        <path
          d="M72 32L78 18L86 28"
          fill="#FED7AA"
          stroke="#5C4D42"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M75 28L78 21L82 27" fill="#F472B6" />

        {/* Right Ear */}
        <path
          d="M86 28L96 20L97 34"
          fill="#FFF8F0"
          stroke="#5C4D42"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M89 27L94 23L95 31" fill="#F472B6" />

        {/* Sleeping Happy Eyes (curved lines ^ ^) */}
        <path
          d="M77 44C78.5 42 81 42 82.5 44"
          stroke="#5C4D42"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M87 44C88.5 42 91 42 92.5 44"
          stroke="#5C4D42"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Nose & Mouth */}
        <path
          d="M85 47L84 49H86L85 47Z"
          fill="#F472B6"
        />
        <path
          d="M85 49V51M83 51C84 52.5 85 52 85 51C85 52 86 52.5 87 51"
          stroke="#5C4D42"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Blush Cheeks */}
        <ellipse cx="74" cy="48" rx="3.5" ry="2" fill="#F472B6" fillOpacity="0.45" />
        <ellipse cx="95" cy="48" rx="3.5" ry="2" fill="#F472B6" fillOpacity="0.45" />

        {/* Curled Tail */}
        <path
          d="M26 62C18 64 12 55 16 46C18 42 22 40 25 43"
          stroke="#5C4D42"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Snooze Zzz text */}
        <text
          x="100"
          y="22"
          fontFamily="sans-serif"
          fontWeight="bold"
          fontSize="12"
          fill="#D97706"
          opacity="0.85"
        >
          z
        </text>
        <text
          x="108"
          y="14"
          fontFamily="sans-serif"
          fontWeight="bold"
          fontSize="9"
          fill="#D97706"
          opacity="0.65"
        >
          z
        </text>
      </svg>
    );
  }

  if (mode === 'paw') {
    const width = size || 24;
    return (
      <svg
        width={width}
        height={width}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <ellipse cx="12" cy="15" rx="5" ry="4" />
        <circle cx="6.5" cy="9.5" r="2" />
        <circle cx="10.2" cy="7.2" r="2" />
        <circle cx="13.8" cy="7.2" r="2" />
        <circle cx="17.5" cy="9.5" r="2" />
      </svg>
    );
  }

  // Peeking Mode
  const width = size || 68;
  const height = (width * 52) / 68;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 68 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left Ear */}
      <path
        d="M14 26L18 8L30 18"
        fill="#FED7AA"
        stroke="#4A3E36"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M18 20L20 12L25 18" fill="#F472B6" />

      {/* Right Ear */}
      <path
        d="M38 18L50 8L54 26"
        fill="#FFFDF9"
        stroke="#4A3E36"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M43 18L48 12L50 20" fill="#F472B6" />

      {/* Head Dome */}
      <path
        d="M14 36C12 26 22 17 34 17C46 17 56 26 54 36C54 44 48 48 34 48C20 48 14 44 14 36Z"
        fill="#FFFDF9"
        stroke="#4A3E36"
        strokeWidth="2.2"
      />

      {/* Calico Patch on Left Ear/Eye */}
      <path
        d="M16 26C16 21 21 18 27 18C28 24 26 29 20 31C17 29 16 27 16 26Z"
        fill="#FED7AA"
      />

      {/* Eyes */}
      <circle cx="26" cy="30" r="2.8" fill="#3D322A" />
      <circle cx="27" cy="29" r="0.9" fill="#FFFFFF" />

      <circle cx="42" cy="30" r="2.8" fill="#3D322A" />
      <circle cx="43" cy="29" r="0.9" fill="#FFFFFF" />

      {/* Blush Cheeks */}
      <ellipse cx="20" cy="35" rx="3" ry="1.8" fill="#F472B6" fillOpacity="0.5" />
      <ellipse cx="48" cy="35" rx="3" ry="1.8" fill="#F472B6" fillOpacity="0.5" />

      {/* Nose */}
      <polygon points="33,33 35,33 34,34.5" fill="#F472B6" />

      {/* Mouth */}
      <path
        d="M32 36C33 37.5 34 37 34 36C34 37 35 37.5 36 36"
        stroke="#4A3E36"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Whiskers */}
      <path d="M12 32L4 31M12 35L5 37" stroke="#4A3E36" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M56 32L64 31M56 35L63 37" stroke="#4A3E36" strokeWidth="1.3" strokeLinecap="round" />

      {/* Two Cute Paws Resting on Edge */}
      {/* Left Paw */}
      <path
        d="M18 52V44C18 41.5 21 41.5 23 44V52"
        fill="#FFFDF9"
        stroke="#4A3E36"
        strokeWidth="2"
      />
      {/* Right Paw */}
      <path
        d="M45 52V44C45 41.5 48 41.5 50 44V52"
        fill="#FFFDF9"
        stroke="#4A3E36"
        strokeWidth="2"
      />
    </svg>
  );
};
