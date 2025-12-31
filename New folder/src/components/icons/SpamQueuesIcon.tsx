import React from 'react';

interface SpamQueuesIconProps {
  size?: number;
  className?: string;
}

export const SpamQueuesIcon: React.FC<SpamQueuesIconProps> = ({ 
  size = 18, 
  className = '' 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.5"
        className="dark:fill-white"
      />
      <line
        x1="7"
        y1="12"
        x2="17"
        y2="12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

