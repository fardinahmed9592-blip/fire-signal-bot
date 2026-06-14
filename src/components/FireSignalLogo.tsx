import React from "react";

interface FireSignalLogoProps {
  variant?: "full" | "icon";
  className?: string;
  iconSize?: number;
}

export const FireSignalLogo: React.FC<FireSignalLogoProps> = ({
  variant = "full",
  className = "",
  iconSize = 40,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Flame Logo Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* Flame Gradients */}
          <linearGradient id="flameBack" x1="20" y1="90" x2="80" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ef4444" /> {/* Red */}
            <stop offset="40%" stopColor="#f97316" /> {/* Orange */}
            <stop offset="100%" stopColor="#facc15" /> {/* Yellow */}
          </linearGradient>
          
          <linearGradient id="flameFront" x1="30" y1="85" x2="60" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ea580c" /> {/* Deep Orange */}
            <stop offset="60%" stopColor="#facc15" /> {/* Bright Gold */}
            <stop offset="100%" stopColor="#fef08a" /> {/* Pale Yellow */}
          </linearGradient>

          {/* Green Trend Arrow Gradient */}
          <linearGradient id="trendArrow" x1="45" y1="80" x2="70" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#15803d" /> {/* Dark Green */}
            <stop offset="50%" stopColor="#22c55e" /> {/* Emerald Green */}
            <stop offset="100%" stopColor="#86efac" /> {/* Light Green */}
          </linearGradient>
          
          {/* Soft Shadow Filter for Premium Feel */}
          <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.2" />
          </filter>
        </defs>

        <g filter="url(#logoShadow)">
          {/* 1. Back Flame Shape (Deep Red/Orange) */}
          <path
            d="M35,90 C18,85 10,65 14,45 C15,52 18,58 24,62 C20,45 28,25 45,10 C40,28 48,38 52,48 C45,45 38,45 32,55 C24,65 24,80 35,90 Z"
            fill="url(#flameBack)"
            opacity="0.95"
          />

          {/* 2. Front Flame Wing (Vivid Gold/Orange) */}
          <path
            d="M50,92 C68,92 82,75 78,55 C74,38 62,25 58,15 C60,25 58,35 55,42 C50,30 40,25 36,40 C34,48 38,58 45,68 C42,66 38,62 35,58 C32,68 38,82 50,92 Z"
            fill="url(#flameFront)"
          />

          {/* 3. Embedded Financial Trend Candlestick Marks */}
          <rect x="36" y="65" width="4" height="15" rx="1" fill="#ea580c" opacity="0.8" />
          <rect x="44" y="55" width="4" height="25" rx="1" fill="#facc15" opacity="0.9" />

          {/* 4. Elegant Breakout Upward Green Arrow */}
          <path
            d="M52,70 L52,45 C52,42 54,40 56,40 L64,40 L64,32 L78,46 L64,60 L64,52 L58,52 C56,52 52,54 52,56 L52,70 Z"
            fill="url(#trendArrow)"
            transform="rotate(-25 56 46)"
            stroke="#022c22"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* Brand Text for Non-collapsed Variant */}
      {variant === "full" && (
        <div className="flex flex-col">
          <span className="font-display font-black text-sm xs:text-base sm:text-lg tracking-widest leading-none text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-amber-100 uppercase">
            FIRE SIGNAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#fef08a] ml-1">AI</span>
          </span>
          <span className="text-[7px] sm:text-[8px] font-mono tracking-[3px] sm:tracking-[4px] text-slate-500 uppercase leading-none mt-1 font-bold">
            NEURAL SCAN ENGINE3.1
          </span>
        </div>
      )}
    </div>
  );
};
