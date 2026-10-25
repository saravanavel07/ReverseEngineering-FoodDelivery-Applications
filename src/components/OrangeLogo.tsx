import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'white';
  className?: string;
}

export const OrangeLogo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '' }) => {
  const isWhite = variant === 'white';
  const textSizeClass =
    size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-2xl sm:text-3xl';

  return (
    <div className={`flex items-center font-extrabold tracking-tight select-none ${className}`}>
      <div className={`flex items-center ${textSizeClass} leading-none`}>
        <span className={isWhite ? 'text-white' : 'text-[#FC8019]'}>Orange</span>
        <span className={isWhite ? 'text-white/90' : 'text-zinc-900'}>Bite</span>
      </div>
    </div>
  );
};
