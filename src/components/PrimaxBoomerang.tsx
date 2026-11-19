import React from "react";

interface PrimaxBoomerangProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
}

export function PrimaxBoomerang({ className = "", size = 48, glow = false }: PrimaxBoomerangProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(255, 105, 0, 0.8)) drop-shadow(0 0 32px rgba(255, 200, 0, 0.5))"
          : undefined,
      }}
    >
      <defs>
        <linearGradient id="primaxGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E63900" />
          <stop offset="45%" stopColor="#FF6900" />
          <stop offset="85%" stopColor="#FFAA00" />
          <stop offset="100%" stopColor="#FFD000" />
        </linearGradient>
        <linearGradient id="primaxGloss" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Boomerang Primax vector curve */}
      <path
        d="M96.8 0.1C74.6 6.9 -0.4 37.6 0.0 62.3C0.0 74.8 14.7 80.8 26.1 85.7C34.1 74.7 42.0 64.5 49.5 55.6L35.0 34.8H51.7C53.8 34.8 55.7 35.8 56.8 37.5L60.4 42.7C81.7 18.9 97.6 5.7 99.1 4.4C99.7 3.9 100 3.3 100 2.5C100 1.3 99.0 0.1 97.4 0.1C97.2 0 97.0 0 96.8 0.1Z"
        fill="url(#primaxGradient)"
      />
      {/* Gloss overlay highlight */}
      <path
        d="M96.8 0.1C74.6 6.9 20 28 8 50C25 45 45 38 60 42.7C81.7 18.9 97.6 5.7 99.1 4.4C99.7 3.9 100 3.3 100 2.5C100 1.3 99.0 0.1 97.4 0.1Z"
        fill="url(#primaxGloss)"
      />
    </svg>
  );
}
