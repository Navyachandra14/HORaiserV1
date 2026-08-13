import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
  variant?: 'full' | 'icon-only';
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtext = true,
  variant = 'full',
  theme = 'dark',
}) => {
  const dimensions = {
    sm: { iconSize: 34, text: 'text-sm sm:text-base', subtext: 'text-[7px]', gap: 'gap-2.5' },
    md: { iconSize: 42, text: 'text-base sm:text-lg', subtext: 'text-[8.5px]', gap: 'gap-3' },
    lg: { iconSize: 54, text: 'text-xl sm:text-2xl', subtext: 'text-[10px]', gap: 'gap-3.5' },
  }[size];

  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subtextColor = theme === 'dark' ? 'text-amber-400 font-extrabold' : 'text-amber-600 font-extrabold';

  return (
    <div className={`flex items-center select-none ${dimensions.gap}`}>
      {/* Precision Brand Emblem SVG with Gold Frame */}
      <div className="relative shrink-0 flex items-center justify-center p-0.5 rounded-2xl bg-gradient-to-br from-amber-400/80 via-amber-300 to-amber-500/80 shadow-sm ring-1 ring-amber-400/30">
        <svg
          width={dimensions.iconSize}
          height={dimensions.iconSize}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 rounded-[20px] transition-transform duration-200 hover:scale-105"
          aria-label="HORAISER Logo Emblem"
        >
          {/* Base Background - Crisp Pure White Tile */}
          <rect width="120" height="120" rx="24" fill="#FFFFFF" />
          <rect width="120" height="120" rx="24" stroke="url(#goldBorderGrad)" strokeWidth="2.5" fill="none" />

          {/* Top Arch */}
          <path
            d="M 28 48 A 32 32 0 0 1 92 48"
            stroke="url(#goldArchGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Top 4-Point Star */}
          <path
            d="M 60 14 L 63 22 L 71 25 L 63 28 L 60 36 L 57 28 L 49 25 L 57 22 Z"
            fill="url(#goldStarGrad)"
          />

          {/* Left 'H' Pillar in Deep Dark Navy */}
          <path
            d="M 32 36 C 32 36, 40 37, 42 42 L 42 78 C 40 83, 32 84, 32 84 H 54 C 54 84, 46 83, 44 78 L 44 42 C 46 37, 54 36, 54 36 Z"
            fill="#0B132B"
          />

          {/* Right 'H' Pillar in Deep Dark Navy */}
          <path
            d="M 66 36 C 66 36, 74 37, 76 42 L 76 78 C 74 83, 66 84, 66 84 H 88 C 88 84, 80 83, 78 78 L 78 42 C 80 37, 88 36, 88 36 Z"
            fill="#0B132B"
          />

          {/* Dark Navy Shadow Swoosh under Winding Road */}
          <path
            d="M 36 84 C 40 70, 52 64, 58 58 C 66 52, 74 46, 70 38 C 62 44, 52 52, 44 60 C 38 68, 34 76, 36 84 Z"
            fill="#070A14"
            opacity="0.85"
          />

          {/* Winding Golden Road Curve */}
          <path
            d="M 38 84 C 42 68, 54 62, 60 56 C 68 50, 76 44, 70 38 C 64 43, 56 50, 48 58 C 42 66, 36 76, 38 84 Z"
            fill="url(#goldPathGrad)"
          />

          {/* Vector Gradients */}
          <defs>
            <linearGradient id="goldArchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>

            <linearGradient id="goldStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A1" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>

            <linearGradient id="goldPathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9A721D" />
              <stop offset="50%" stopColor="#F3E5AB" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>

            <linearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col">
          <span
            className={`font-['Cinzel',serif] font-bold tracking-[0.22em] leading-none ${textColor} ${dimensions.text}`}
          >
            HORAISER
          </span>
          {showSubtext && (
            <span
              className={`tracking-[0.18em] uppercase mt-1 ${subtextColor} ${dimensions.subtext}`}
            >
              CAPTURE • UNDERSTAND • RISE
            </span>
          )}
        </div>
      )}
    </div>
  );
};
