import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showSubtitle = true }) => {
  const logoDimensions = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Gym Logo Image */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-1 bg-red-600/30 rounded-full blur-sm group-hover:bg-red-600/50 transition duration-300"></div>
        <img
          src="/assets/iron-logo.png"
          alt="Iron Revolution Gym Logo"
          className={`${logoDimensions[size]} relative rounded-full object-cover border border-white/20 shadow-xl bg-black`}
        />
      </div>

      <div className="flex flex-col">
        <div className={`font-display tracking-wider font-extrabold text-white leading-none ${textSizes[size]}`}>
          IRON <span className="text-[#FF1E27] drop-shadow-[0_0_10px_rgba(255,30,39,0.5)]">REVOLUTION 2.0</span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-mono tracking-wider text-[#A1A1AA] uppercase">
              Naroli, Silvassa
            </span>
            <span className="w-1 h-1 rounded-full bg-[#FF1E27]"></span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              Gym & Fitness
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
