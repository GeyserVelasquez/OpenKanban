"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer blue ring */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        fill="#1976D2" 
      />
      
      {/* Inner light blue circle */}
      <circle 
        cx="100" 
        cy="100" 
        r="70" 
        fill="#B3E5FC" 
      />
      
      {/* Hourglass - top triangle */}
      <path
        d="M 65 70 L 100 105 L 135 70 L 135 60 L 65 60 Z"
        fill="#1976D2"
      />
      
      {/* Hourglass - bottom triangle */}
      <path
        d="M 65 130 L 100 95 L 135 130 L 135 140 L 65 140 Z"
        fill="#1976D2"
      />
    </svg>
  );
}
