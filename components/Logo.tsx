'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'icon';
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function Logo({ 
  className = '', 
  variant = 'full',
  width,
  height,
  priority = false
}: LogoProps) {
  if (variant === 'icon') {
    return (
      <svg 
        viewBox="0 0 100 100" 
        className={`aspect-square shrink-0 ${className}`}
        width={width ?? 40}
        height={height ?? 40}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100" height="100" rx="20" fill="#202426" />
        <g transform="translate(15, 12)">
          {/* Stylized S */}
          <path 
            d="M 50,14 C 45,5 34,2 24,2 C 10,2 2,9 2,19 C 2,30 13,34 26,37 C 40,40 50,45 50,58 C 50,71 39,78 25,78 C 12,78 2,72 0,61" 
            stroke="#EDEAE4" 
            fill="none" 
            strokeWidth="7.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Burnt Orange Accent Node */}
          <circle cx="56" cy="10" r="5" fill="#B8522E" />
        </g>
      </svg>
    );
  }

  // Full brand vector wordmark using the official public/logo.svg
  return (
    <Image 
      src="/logo.svg" 
      alt="SALiNO Project Management & Resale"
      width={width ?? 200}
      height={height ?? 80}
      priority={priority}
      className={`shrink-0 object-contain aspect-[800/320] ${className}`}
    />
  );
}
